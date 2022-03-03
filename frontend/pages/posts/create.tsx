import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

const PostCreate = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios.post("/posts", values).then(({ data }) => {
        router.push("/posts");
      });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        noValidate
        sx={{
          marginTop: 8,
        }}
        onSubmit={formik.handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="title"
              label="Title"
              name="title"
              fullWidth
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="content"
              name="content"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default PostCreate;
