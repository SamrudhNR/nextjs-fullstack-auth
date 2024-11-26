"use client"

import axios from "axios"
import Link from "next/link"
import React from "react"



export default function ForgotPasswordPage(){
    const [email, setEmail] = React.useState('')
    
    const onForgotPassword = async () => {
        try {
            await axios.post('/api/users/forgotpassword', {email})
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <section 
            className="min-h-screen flex flex-col"
            style={{background: 'rgb(17,24,39)'}}
        >
            <div className="flex flex-1 items-center justify-center">
                <div className="px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">
                    <form className="text-center">
                        <h1 
                            className="font-bold tracking-wider text-3xl mb-8 w-full text-white"
                        >   Forgot password  </h1>
                        <div className="py-2 text-left">
                            <input 
                                className="focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700 bg-slate-800 " 
                                placeholder="Email" 
                                type="email" 
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                />
                        </div>
                        <div className="py-2">
                            <button 
                                type="submit" 
                                className=" focus:outline-none bg-indigo-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg 
                                hover:bg-indigo-500 "
                                onClick={onForgotPassword}
                            > Submit </button>
                        </div>
                    </form>
                    <div className="text-center flex justify-around">
                        <Link 
                            href="/signup" 
                            className="hover:text-indigo-500 ml-2 no-underline  text-indigo-600 font-semibold"
                        >Signup</Link>
                        <Link 
                            href="/login" 
                            className="hover:text-indigo-500 ml-2 no-underline  text-indigo-600 font-semibold"
                        >Login</Link>
                    </div>
                </div>
            </div>
        </section>
        )
    }