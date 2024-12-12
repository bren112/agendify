import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import img from './title.png';
import './Login.css';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // Define branco como cor principal
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Borda branca
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Borda branca ao passar o mouse
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Borda branca ao focar
          },
          color: '#ffffff', // Texto digitado em branco
        },
        input: {
          color: '#ffffff', // Texto digitado em branco
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Cor do placeholder em branco
          '&.Mui-focused': {
            color: '#ffffff', // Placeholder ao focar em branco
          },
        },
      },
    },
  },
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default Login;
