"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

 function Verification() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  axios.defaults.withCredentials = true
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      if(!data){
        return
      }
      try{
        const res = await axios.post("http://localhost:3000/user/addnewUser/verify",data)
        if(res.data.success){
          console.log(res.data.message)
          console.log("account created successfully")

        }else{
          console.log("pin is incorrect")

        }
      }catch(err){
        console.log(err)
      }


  }

  return (
    <Form {...form}>
    <div className="w-screen h-screen flex justify-center items-center bg-neutral-200 ">
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white rounded-2xl">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot     index={0} />
                    <InputOTPSlot  index={1} />
                    <InputOTPSlot  index={2} />
                    <InputOTPSlot  index={3} />
                    <InputOTPSlot  index={4} />
                    <InputOTPSlot  index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your Email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
    </Form>
  )
}

export default Verification