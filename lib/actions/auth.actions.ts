'use server'

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail = async ({email,password,fullName,country,investmentGoals,riskTolerance,preferredIndustry}:SignUpFormData)=> {
    try {
        const response = await auth.api.signUpEmail({
            body: {email,password, name:fullName},
            headers: await headers()
        })
        if(response){
            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: {
                        email,
                        name: fullName,
                        country,
                        investmentGoals,
                        riskTolerance,
                        preferredIndustry
                    }
                })
            } catch (inngestError) {
                console.error('Inngest Send Failed', inngestError)
                // We don't necessarily want to fail the whole sign up if Inngest fails
            }
        }
        return {success:true, data:response}
    } catch (e) {
        console.error('Sign Up Error:', e)
        return {success:false, error : e instanceof Error ? e.message : 'Sign Up Failed'}
    }
}

export const signInWithEmail = async ({email,password}:SignInFormData)=>{
    try {
        const response = await auth.api.signInEmail({
            body:{email,password},
            headers: await headers()
        })
        return {success:true, data:response}
    }catch (e){
        console.error("Sign In Error:", e)
        return {success:false, error: e instanceof Error ? e.message : 'Sign In Failed'}
    }
}
export const signOut = async ()=>{
    try {
        await auth.api.signOut({headers: await headers()})
        return {success:true}
    }catch (e){
        console.log("Sign Out Failed",e)
        return {success:false, error: 'Sign Out Failed'}
    }
}

