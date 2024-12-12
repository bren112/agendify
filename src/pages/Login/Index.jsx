import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import img from './title.png';
import './Login.css';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Substitua pelo envio real do formulário
  };

  return (
    <div className="home">
      <div className="img">
        <img src={img} alt="Título" />
      </div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          {...register('email', { required: 'O email é obrigatório.' })}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          {...register('password', { required: 'A senha é obrigatória.' })}
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Entrar
        </Button>
      </form>
    </div>
  );
}

export default Login;
