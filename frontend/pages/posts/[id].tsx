import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

import Error from "../_error";
import { setTokenToHeader } from "../../utils/auth";
import { Post } from "../../interfaces/post.interface";

interface PostEditProps {
  post: Post;
  error?: number;
}

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const axios = setTokenToHeader(context);
    const response = await axios.get(`/posts/${context.params?.id}`);

    return {
      props: { post: response.data.post },
    };
  } catch (error: any) {
    console.log(error);
    return { props: { post: {}, error: error.response.status } };
  }
};

const PostEdit = (props: PostEditProps) => {
  const { post } = props;
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      title: post.title,
      content: post.content,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios.put(`/posts/${post.id}`, values).then(({ data }) => {
        router.push("/posts");
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
          Update
        </Button>
      </Box>
    </Container>
  );
};

export default PostEdit;
