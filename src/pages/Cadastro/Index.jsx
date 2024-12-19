import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Snackbar, Alert, Box, Typography } from '@mui/material';
import InputMask from 'react-input-mask';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { supabase } from '../../supabase/supabase';
import title from './title.png'
import { Link } from 'react-router-dom';
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
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
          },
          color: '#000000',
        },
        input: {
          color: '#000000',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000000',
          '&.Mui-focused': {
            color: '#000000',
          },
        },
      },
    },
  },
});

function Cadastro() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const handleCadastro = async (data) => {
    try {
      const { error } = await supabase.from('usuarios').insert([{
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        senha: data.senha, // Enviando a senha corretamente
      }]);

      if (error) {
        setSnackbarMessage('Erro ao cadastrar usuário.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Cadastro realizado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Erro ao tentar cadastro:', err);
      setSnackbarMessage('Erro ao tentar cadastro');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
       <div className="centro2">
    <img src={title} alt="" srcset="" />
    </div>
 
    <ThemeProvider theme={theme}>
      <Box className="home" display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" style={{ marginBottom: '16px', color: '#000000' }}>
          Cadastro
        </Typography>
        <form className="form" onSubmit={handleSubmit(handleCadastro)}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            {...register('nome', { required: 'O nome é obrigatório.' })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email', { required: 'O email é obrigatório.', pattern: /^\S+@\S+$/i })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <Controller
            name="telefone"
            control={control}
            rules={{ required: 'O telefone é obrigatório.' }}
            render={({ field }) => (
              <InputMask
                mask="(99) 99999-9999"
                {...field}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                    margin="normal"
                  />
                )}
              </InputMask>
            )}
          />
          <Controller
            name="cpf"
            control={control}
            rules={{
              required: 'O CPF é obrigatório.',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                message: 'CPF inválido. Use o formato 123.456.789-10',
              },
            }}
            render={({ field }) => (
              <InputMask
                mask="999.999.999-99"
                {...field}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="CPF"
                    variant="outlined"
                    fullWidth
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                    margin="normal"
                  />
                )}
              </InputMask>
            )}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            {...register('senha', {
              required: 'A senha é obrigatória.',
              minLength: {
                value: 6,
                message: 'A senha deve ter no mínimo 6 caracteres.',
              },
            })}
            error={!!errors.senha}
            helperText={errors.senha?.message}
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
            Cadastrar
          </Button>
          <Link to="/login">
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
            Já Tenho Uma Conta!
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

export default Cadastro;
