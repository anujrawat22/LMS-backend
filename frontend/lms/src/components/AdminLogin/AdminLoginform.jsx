import { Button, Container, FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'

const AdminLoginform = ({ setToggle }) => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    return (
        <Container maxWidth="xs"  >
            <form onSubmit={handleSubmit((data) => {
                console.log(data)
            })}>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="login"
                        name="login"
                        sx={{ display: 'flex', flexDirection: 'row' }} // Apply styles using sx prop
                    >
                        <FormControlLabel value="admin" control={<Radio />} onClick={() => setToggle('admin')} label="Admin" />
                        <FormControlLabel value="user" control={<Radio />} onClick={() => setToggle('user')} label="User" />
                    </RadioGroup>
                </FormControl>
                <Stack spacing={2}>
                    <Typography variant='caption' color={"red"}>{errors.email?.message}</Typography>
                    <TextField id="outlined-basic" label="Email*" variant="outlined" size="small" {...register('email', {
                        required: "Required field *", pattern: {
                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                            message: 'Please enter correct email',
                        },
                    })} />
                    <Typography variant='caption' color={"red"}>{errors.password?.message}</Typography>
                    <TextField id="outlined-basic" label="Password*" variant="outlined" size="small" type='password' {...register('password', { required: "Required field *" })} />
                    <Button variant='outlined' type='submit'>LOGIN</Button>
                </Stack>
            </form>

        </Container>
    )
}

export default AdminLoginform