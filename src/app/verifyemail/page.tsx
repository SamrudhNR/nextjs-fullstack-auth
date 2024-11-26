// "use client";

// import axios from "axios";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";


// export default function VerifyEmailPage() {

//     const [token, setToken] = useState("");
//     const [verified, setVerified] = useState(false);
//     const [error, setError] = useState(false);

//     const verifyUserEmail = async () => {
//         try {
//             await axios.post('/api/users/verifyemail', {token})
//             setVerified(true);
//         } catch (error:any) {
//             setError(true);
//             console.log(error.response.data);
            
//         }

//     }

//     useEffect(() => {
//         const urlToken = window.location.search.split("=")[1];
//         setToken(urlToken || "");
//     }, []);


//     useEffect(() => {
//         if(token.length > 0) {
//             verifyUserEmail();
//         }
//     }, [token]);

//     return(
//         <div className="flex flex-col items-center justify-center min-h-screen py-2">

//             <h1 className="text-4xl">Verify Email</h1>
//             <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

//             {verified && (
//                 <div>
//                     <h2 className="text-2xl">Email Verified</h2>
//                     <Link href="/login">
//                         Login
//                     </Link>
//                 </div>
//             )}
//             {error && (
//                 <div>
//                     <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    
//                 </div>
//             )}
//         </div>
//     )

// }
"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to verify the user email
  const verifyUserEmail = async () => {
    try {
      // Sending POST request to backend to verify token
      const response = await axios.post('/api/users/verifyemail', { token });
      console.log("Server response:", response);
      // On successful verification, update the state
      setVerified(true);
    } catch (error: any) {
      // In case of error, set the error message
      setError(error?.response?.data?.error || "An unknown error occurred");
      console.error(error?.response?.data); // Log the error to console for debugging
    }
  };

  // Extract token from URL when the page loads
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    console.log('niggaaaaaaa')
    console.log("Extracted token from URL:", urlToken); // Log to verify token
    setToken(urlToken || "");
  }, []);

  // Trigger email verification when the token changes
  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Verify Email</h1>

      {/* Displaying the token */}
      <h2 className="p-2 bg-orange-500 text-black mb-4">{token ? `Token: ${token}` : "No token found"}</h2>

      {/* Showing success message */}
      {verified && (
        <div>
          <h2 className="text-2xl text-green-600">Email Verified Successfully!</h2>
          <Link href="/login" className="text-blue-500">
            Go to Login Page
          </Link>
        </div>
      )}

      {/* Showing error message */}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-white p-2">{error}</h2>
        </div>
      )}
    </div>
  );
}
