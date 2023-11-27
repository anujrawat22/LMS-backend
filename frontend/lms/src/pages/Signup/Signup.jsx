import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'

const Signup = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    return (
        <div style={{ margin: "auto", width: "30dvw", height: "auto", marginTop: "10dvh", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", padding: "7rem 0", borderRadius: "5%" }} >
            <Typography variant="h4" textAlign={"center"}>
                Signup
            </Typography>;
            <Container maxWidth="xs" >
                <form onSubmit={handleSubmit((data) => {
                    console.log(data)
                })}>
                    <Stack spacing={3}>
                        <TextField id="outlined-basic" label="Username*" variant="outlined" size="small" {...register('username', { required: true })} />
                        <TextField id="outlined-basic" label="Email*" variant="outlined" size="small" {...register('email', {
                            required: true, pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                                message: 'Please enter correct email',
                            },
                        })} />
                        <Typography variant='caption' color={"red"}>{errors.email?.message}</Typography>
                        <TextField id="outlined-basic" label="Password*" variant="outlined" size="small" type='password' {...register('password', {
                            required: true, minLength: {
                                value: 8,
                                message: "Password must have 8 characters"
                            }
                        })} />
                        <Typography variant='caption' color={"red"}>{errors.password?.message}</Typography>

                        <Button variant='outlined' type='submit'>Signup</Button>
                    </Stack>
                </form>
            </Container>
        </div>
    )
}

export default Signup