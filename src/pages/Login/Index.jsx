import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Snackbar, Alert, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { supabase } from '../../supabase/supabase'; 
import title from './title.png'
import { Link } from 'react-router-dom';
import './Login.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#212121',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#212121',
          },
          color: '#424242',
        },
        input: {
          color: '#424242',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-focused': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

function Login() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    try {
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('email, senha')
        .eq('email', data.email)
        .eq('senha', data.password)
        .single();

      if (error || !userData) {
        setSnackbarMessage('Credenciais inválidas');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Login bem-sucedido!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Erro ao tentar login:', err);
      setSnackbarMessage('Erro ao tentar login');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
    <div className="centro">
    <img src={title} alt="" srcset="" />
    </div>
    <ThemeProvider theme={theme}>
      <Box className="home" display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" style={{ marginBottom: '16px', color: '#000000' }}>
          Login
        </Typography>
        <form className="form" onSubmit={handleSubmit(handleLogin)}>
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
            style={{
              marginTop: '16px',
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          >
            Entrar
          </Button>
<Link to='/cadastro'>
          <Button
            type=""
            variant="contained"
            color="primary"
            fullWidth
            style={{
              marginTop: '16px',
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          >
            Não Tenho Uma Conta!
          </Button>
          </Link>
        
        </form>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
    </>
  );
}

export default Login;
