// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from 'bcryptjs'

// connect()

// export async function POST(request: NextRequest){
//     try {
//         const reqBody = await request.json()
//         const { token, password } = reqBody
//         console.log(token)
//         console.log(password)
//         const user = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}})
//         if(!user){
//             return NextResponse.json({error: 'invalid token'}, {status: 400})
//         }
//         else {
            
//         }
//         console.log(user)

//         // hashed password
//         const salt = await bcryptjs.genSalt(10);
//         const hashedPassword = await bcryptjs.hash(password, salt);
        
//         user.password = hashedPassword
//         user.forgotPasswordToken = undefined
//         user.forgotPasswordTokenExpiry = undefined
//         await user.save()

//         return NextResponse.json({
//             message: 'reset password successfully',
//             success: true,
//         })
        
//     } catch (error: any) {
//         return NextResponse.json({error: error.message}, {status: 500})
//     } finally {

//     }
// }

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token, password } = reqBody;

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required." },
                { status: 400 }
            );
        }

        console.log("Token received:", token);

        // Find user by token expiry (no direct comparison with hashed token yet)
        const user = await User.findOne({
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token." },
                { status: 400 }
            );
        }

        console.log("User found:", user);

        // Compare the received token with the hashed token in the database
        const isTokenValid = await bcryptjs.compare(token, user.forgotPasswordToken);

        if (!isTokenValid) {
            return NextResponse.json(
                { error: "Invalid token." },
                { status: 400 }
            );
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Update the user's password and clear the token fields
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Password reset successfully.",
            success: true,
        });
    } catch (error: any) {
        console.error("Error resetting password:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error." },
            { status: 500 }
        );
    }
}
