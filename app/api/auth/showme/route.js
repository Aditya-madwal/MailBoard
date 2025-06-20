import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { validateAuth } from '../../../../lib/auth'

export async function GET(request) {
  try {
    await dbConnect()

    // Validate authentication
    const authResult = await validateAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { message: authResult.error },
        { status: 401 }
      )
    }

    // Find user
    const user = await User.findById(authResult.user.userId).select('-password')
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('ShowMe error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
// import { cookies } from "next/headers";
// import { NextResponse } from 'next/server'
// import { verify } from "jsonwebtoken";
// import { JWT_COOKIE_NAME } from "../../../../constants/authconstants";


// export async function GET(request) {
//   const cookieStore = cookies();
//   const token = cookieStore.get(JWT_COOKIE_NAME)?.value;


//   if (!token) {
//     return NextResponse.json({
//       user: null,
//       error: {
//         message: "Unauthorized access"
//       }
//     }, { status: 401 });
//   }

//   try {
//     const secret = process.env.JWT_SECRET || "";
//     const decoded = verify(token, secret);
//     return NextResponse.json({
//       user: decoded,
//       error: null
//     });
//   } catch (error) {
//     return NextResponse.json({
//       user: null,
//       error: {
//         message: "Invalid token"
//       }
//     }, { status: 401 });
//   }

//   // return NextResponse.json({
//   //   user:
//   //     // name: "Aditya",
//   //     // email: "aditya@example.com",
//   //     null
//   //   , error: {
//   //     message: "Invalid token"
//   //   }
//   // });
//   return NextResponse.json({
//     user: null,
//     error: {
//       message: "Unauthorized access"
//     }
//   }, { status: 401 });
// }