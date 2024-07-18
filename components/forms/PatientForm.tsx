"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import SubmitButton from '../SubmitButton'
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = 'input',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}
 
 
const PatientForm = () => {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email:"",
      phone: ""
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async (values : z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        console.log('New User ID:', newUser.$id); // Check the new user ID
        router.push(`/patients/${newUser.$id}/register`);
      } else {
        console.error("Failed to create or find a user.");
      }

    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }

    setIsLoading(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi There 👋 </h1>
            <p className="text-dark-700">schedule your first appointment.</p>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />
         <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />
        <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="+30 210 1234567"
        />

        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
