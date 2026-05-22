'use client'
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLinks from "@/components/forms/FooterLinks";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues : {
            fullName :'',
            email :'',
            password : '',
            country : 'US',
            investmentGoals: 'Growth',
            riskTolerance : 'InputsMedium',
            preferredIndustry : 'Technology'
        },
        mode: 'onBlur'
    })
    const onSubmit = async (data: SignUpFormData) => {
        try {
            console.log(data)
        }catch (e){
            console.log(e)
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalized</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                name="fullName"
                label="Full Name"
                placeholder="Mohamed Hasmath"
                register={register}
                error={errors.fullName}
                validation={{required:'Full Name is required', minLength:2}}
                />

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
                    placeholder={"Enter a Strong Password"}
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{required:'Password is required', minLength:12}}
                />

                <CountrySelectField
                name="country"
                label="Country"
                control={control}
                error={errors.country}
                required
                />


                <SelectField
                name="investmentGoals"
                label="Investment Goals"
                placeholder="Select Your Investment Goal"
                options={INVESTMENT_GOALS}
                control={control}
                error={errors.investmentGoals}
                required
                />

                <SelectField
                    name="riskTolerance"
                    label="RiskTolerance"
                    placeholder="Select Your Risk Level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select Your Prefered Industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Creating Account' : 'Start Your Investing Journey'}
                </Button>
                
                <FooterLinks text="Already have an account?" linkText="Sign In" href="/sign-in"/>
            </form>
        </>
    )
}
export default SignUp
