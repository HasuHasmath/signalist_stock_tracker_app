'use client'
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLinks from "@/components/forms/FooterLinks";
import {signInWithEmail} from "@/lib/actions/auth.actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const SignIn = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues : {
            email :'',
            password : '',
        },
        mode: 'onBlur'
    })

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data)
            if(result.success)router.push('/')
        }catch (e){
            console.log(e)
            toast.error('Sign In Failed.',{
                description: e instanceof Error ? e.message : 'Failed to Sign In'
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome Back</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="abc@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{required:'Email is required', pattern:'/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/'}}
                />

                <InputField
                    name='password'
                    label='Password'
                    placeholder={"Enter your Password"}
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{required:'Password is required'}}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>

                <FooterLinks text="Don't have an account?" linkText="Sign Up" href="/sign-up"/>
            </form>
        </>
    )
}
export default SignIn
