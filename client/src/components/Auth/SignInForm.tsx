import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function SignInForm() {
const [isLoading,setisLoading] = useState<boolean>(false)
const [isSuccess,setisSuccess] = useState<boolean>(false)
const [isError,setisError] = useState<boolean>(false)
const navigate = useNavigate()
  
      const FormSchema = z.object({
          email: z.string().email(),
          password: z.string().min(8),
          confirmPassword: z.string(),
})
        .refine((data) => data.password === data.confirmPassword, {
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
    
      const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          email: "",
          password: "",
          confirmPassword: "",
        },
      });
        axios.defaults.withCredentials = true
        const onSubmit = async (data: z.infer<typeof FormSchema>) => {
          if(!data){
            return 
          }
          setisLoading(true)
          try{
            const res = await axios.post("http://localhost:3000/user/addnewUser",data)
            if(res.data.success){
                console.log("Check Your Email For Verifcation")
                setisSuccess(true)
                navigate(`/verify/${data.email}`)
                localStorage.setItem("email", data.email)
            }else{
              console.log(res.data.message)
            }
          }catch(error:any){
           if(error){
            console.log(error.response.data.message)
           }
            setisError(true)

          }



          // form.reset({
          //   email : "",
          //   password : "",
          //   confirmPassword : ""
          // })

  };

  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative">
             <h2 className="text-lg font-bold text-center mb-4">
   Create your account.
</h2>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading ? "Registering..." : "Register"}
            </Button>

            {isSuccess && <p>Sign in Successfully Please Check you email for Verifcation code</p>}
            {isError && <p>Failed to sign in Please try again</p>}
            </form>
        
        </Form>
  )
}

export default SignInForm
