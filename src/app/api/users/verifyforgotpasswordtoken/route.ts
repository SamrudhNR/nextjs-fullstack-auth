
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

connect();

// export async function POST(request: NextRequest) {
//     try {
//         const reqBody = await request.json();
//         const { token } = reqBody;


//         if (!token) {
//             return NextResponse.json({ error: "Token is required" }, { status: 400 });
//         }

//         console.log("Received token:", token);

// \

//         // Find the user with a non-expired token
//         const user = await User.findOne({
//             forgotPasswordToken: token, // If the token is stored as plain text
//             forgotPasswordTokenExpiry: { $gt: Date.now() }, // Check if token is still valid
//         });

//         if (!user) {
//             return NextResponse.json(
//                 { error: "Invalid or expired token" },
//                 { status: 400 }
//             );
//         }

//         // Compare the received token with the hashed token in the database
//         const isValidToken = await bcrypt.compare(token, user.forgotPasswordToken);

//         if (!isValidToken) {
//             return NextResponse.json(
//                 { error: "Invalid token" },
//                 { status: 400 }
//             );
//         }

//         // Clear the token and expiry fields
//         user.isVerified = true;
//         user.forgotPasswordToken = undefined;
//         user.forgotPasswordTokenExpiry = undefined;
//         await user.save();

//         return NextResponse.json({
//             message: "Token verified successfully",
//             status: true,
//         });
//     } catch (error: any) {
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }



export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        console.log("Token received:", token);

        // Find user based on token and expiry
        const user = await User.findOne({
            verifyToken: token, // Match the token exactly
            verifyTokenExpiry: { $gt: Date.now() }, // Ensure the token is not expired
        });

        if (!user) {
            console.log("No user found or token expired.");
            return NextResponse.json({ error: "Invalid token or token expired" }, { status: 400 });
        }

        console.log("User found from database:", user);

        // If the token is hashed, compare it using bcrypt
        const isValidToken = await bcrypt.compare(token, user.verifyToken);
        
        if (!isValidToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        // Update user verification status
        user.isVerified = true;
        user.verifyToken = undefined;  // Clear the token after successful verification
        user.verifyTokenExpiry = undefined;  // Clear the expiry after successful verification
        await user.save();

        return NextResponse.json({
            message: "Password reset successful",
            success: true,
        });
    } catch (error: any) {
        console.error("Error verifying token:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

