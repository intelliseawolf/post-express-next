import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

import Error from "../_error";

import { handleAuthSSR, setTokenToHeader } from "../../utils/auth";
import { User } from "../../interfaces/user.interface";

interface UserEditProps {
  user: User;
  error?: number;
}

const validationSchema = yup.object({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await handleAuthSSR(context, "admin");
    const axios = setTokenToHeader(context);
    const response = await axios.get(`/users/${context.params?.id}`);

    return {
      props: { user: response.data.user },
    };
  } catch (error: any) {
    return {
      props: { user: {}, error: error.response.status },
    };
  }
};

const UserEdit = (props: UserEditProps) => {
  const { user } = props;
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      status: user.status.toString(),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .put(`/users/${user.id}`, {
          ...values,
          // @ts-ignore
          status: values.status === "true",
        })
        .then(({ data }) => {
          router.push("/users");
        });
    },
  });

  if (props.error) {
    return <Error statusCode={props.error} />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        noValidate
        sx={{
          marginTop: 8,
        }}
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="firstname"
              name="firstname"
              label="First Name"
              fullWidth
              value={formik.values.firstname}
              onChange={formik.handleChange}
              error={
                formik.touched.firstname && Boolean(formik.errors.firstname)
              }
              helperText={formik.touched.firstname && formik.errors.firstname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="lastname"
              label="Last Name"
              name="lastname"
              fullWidth
              value={formik.values.lastname}
              onChange={formik.handleChange}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
              helperText={formik.touched.lastname && formik.errors.lastname}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                id="role"
                name="role"
                fullWidth
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                id="status"
                name="status"
                fullWidth
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <MenuItem value="true">Approve</MenuItem>
                <MenuItem value="false">Disapprove</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
      </Box>
    </Container>
  );
};

export default UserEdit;
