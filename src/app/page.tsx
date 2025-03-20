'use client'

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FetchService } from "./fetch.service";
import {z} from 'zod';

const _FormFieldsProps = z.coerce.string().email({message: 'value is required'})

type FormFieldsProps = {
  contactType: 'mobile'|'email',
  contactValue: string,
}

interface ResponseSuccess {
  message: string
  status: string
}

export default function Home() {
  const [fieldValue, setFieldValue] = useState('');
  const [contactType, setContactType] = useState<'mobile'|'email'>('mobile');
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState<boolean|undefined>(undefined)
  
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    
    formState: { errors, isLoading, isSubmitting },
  } = useForm<FormFieldsProps>()
  const onSubmitHandler: SubmitHandler<FormFieldsProps> = (data, e) => {
    
    e?.preventDefault();
    setLoading(true);
    setFieldValue('');
    
    FetchService({type: contactType, value: data.contactValue})
      .then((res: ResponseSuccess) => {
        console.log({res})
        setIsSuccess(res.status.toLowerCase() === 'success')
        setSubmitSuccessMessage(res.message)
      })
      .catch(setSubmitErrorMessage)
      .finally(() => setLoading(false))
    console.log(data)
  }
  

  return (
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <header>
            <h1>Coming Soon!</h1>
            <h2>Join the waitlist below.</h2>
            <p>Be the first to know when tickets drop! Enter your email to join the waitlist</p>
          </header>
          <div className={isSuccess ? 'border-green': ''}>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <fieldset className="flex gap-2">
                <div className="gap-4">
                  <span className={contactType === 'mobile' ? 'bg-red-200' : ''} role="button" onClick={() => setContactType('mobile')}>mobile</span>
                  <span className={contactType === 'email' ? 'bg-red-200' : ''} role="button" onClick={() => setContactType('email')}>email</span>
                </div>
                
                <input 
                  className="border-2" 
                  {...register('contactValue', {required: true})}
                  type={contactType === 'mobile' ? 'tel' : 'email'} 
                  value={fieldValue} 
                  placeholder={contactType === 'mobile' ? '' : 'Enter email address'}
                  onChange={(e) => setFieldValue(e.target.value)} />

                <button className="bg-red-300 text-white p-2" disabled={isSubmitting} type="submit">{isSubmitting ? 'submiting': 'Join the waitlist'}</button>
              
              </fieldset>
              {submitErrorMessage ? <p>{submitErrorMessage}</p> : <></>}
              
            </form>
          </div>
      </main>
  );
}
