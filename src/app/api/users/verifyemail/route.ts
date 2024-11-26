import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from 'bcrypt';


connect()


// export async function POST(request: NextRequest){

//     try {
//         const reqBody = await request.json()
//         const {token} = reqBody
//         console.log(token);

//         const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

//         if (!user) {
//             return NextResponse.json({error: "Invalid token"}, {status: 400})
//         }
//         console.log(user);

//         user.isVerfied = true;
//         user.verifyToken = undefined;
//         user.verifyTokenExpiry = undefined;
//         await user.save();
        
//         return NextResponse.json({
//             message: "Email verified successfully",
//             success: true
//         })


//     } catch (error:any) {
//         return NextResponse.json({error: error.message}, {status: 500})
//     }

// }


// export async function POST(request: NextRequest) {
//     try {
//         const reqBody = await request.json();
//         const { token } = reqBody;

//         if (!token) {
//             console.log("No token provided in the request.");
//             return NextResponse.json({ error: "Token is required" }, { status: 400 });
//         }
//         console.log("Token received:", token);

//         // Query database
//         console.log("Performing database query...");
//         const user = await User.findOne({
//             verifyToken: token,
//             verifyTokenExpiry: { $gt: Date.now() },
//         });
//         console.log("User from database:", user);

//         if (!user) {
//             console.log("No user found or token expired.");
//             return NextResponse.json({ error: "Invalid token or token expired" }, { status: 400 });
//         }

//         console.log("Hashed token from database:", user.verifyToken);

//         // Compare tokens
//         const isValidToken = await bcrypt.compare(token, user.verifyToken);
//         console.log("Is token valid:", isValidToken);

//         if (!isValidToken) {
//             console.log("Token comparison failed.");
//             return NextResponse.json({ error: "Invalid token" }, { status: 400 });
//         }

//         // Update user
//         user.isVerified = true;
//         user.verifyToken = undefined;
//         user.verifyTokenExpiry = undefined;
//         await user.save();
//         console.log("User verified successfully:", user);

//         return NextResponse.json({
//             message: "Email verified successfully",
//             success: true,
//         });
//     } catch (error: any) {
//         console.error("Error verifying email:", error.message);
//         return NextResponse.json({ error: error.message }, { status: 500 });
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

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });
        console.log("User from database:", user);
        
        if (!user) {
            console.log("No user found or token expired.");
            return NextResponse.json({ error: "Invalid token or token expired" }, { status: 400 });
        }

        console.log("Hashed token from database:", user.verifyToken);

        // If the token is stored as plaintext
        if (token === user.verifyToken) {
            console.log("Token is valid.");
        } else {
            // If the token is hashed and bcrypt is needed for comparison
            const isValidToken = await bcrypt.compare(token, user.verifyToken);
            console.log("Is token valid:", isValidToken);

            if (!isValidToken) {
                console.log("Token comparison failed.");
                return NextResponse.json({ error: "Invalid token" }, { status: 400 });
            }
        }

        // Update user to mark as verified
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });

    } catch (error: any) {
        console.error("Error verifying email:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}