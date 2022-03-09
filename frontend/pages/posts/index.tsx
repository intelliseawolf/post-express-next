import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

import ConfirmModal from "../../components/confirmModal";
import { setTokenToHeader } from "../../utils/auth";
import { Post } from "../../interfaces/post.interface";
import { useAppSelector } from "../../store/hooks";

const ButtonBar = styled("div")(() => ({
  display: "flex",
  justifyContent: "end",
}));

interface PostIndexProps {
  posts: Post[];
  count: number;
}

interface PaginationState {
  perPage: number;
  page: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const axios = setTokenToHeader(context);
  const response = await axios.get("/posts", {
    params: {
      perPage: context.query.perPage || 5,
      page: context.query.page || 0,
    },
  });

  return {
    props: { posts: response.data.posts, count: Number(response.data.count) },
  };
};

const PostIndex = (props: PostIndexProps) => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(props.posts);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    perPage: Number(router.query.perPage) || 5,
    page: Number(router.query.page) || 0,
  });
  const { currentUser } = useAppSelector((state) => state.auth);

  function handleChangePage(event: unknown, newPage: number) {
    setPaginationState({
      ...paginationState,
      page: newPage,
    });
    getPostsByPagination(newPage, paginationState.perPage);
  }

  function handleChangePerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setPaginationState({
      page: 0,
      perPage: parseInt(event.target.value, 10),
    });
    getPostsByPagination(0, parseInt(event.target.value, 10));
  }

  function getPostsByPagination(page: number, perPage: number) {
    router.push({
      pathname: "/posts",
      query: {
        perPage: perPage,
        page: page,
      },
    });
    getPosts({
      perPage: perPage,
      page: page,
    });
  }

  function getPosts(pagination: PaginationState = paginationState) {
    axios
      .get("/posts", {
        params: {
          perPage: pagination.perPage || 5,
          page: pagination.page || 0,
        },
      })
      .then(({ data }) => {
        setPosts(data.posts);
      });
  }

  function handleDelete(item: Post) {
    setDeleteModal(true);
    setDeletingPost(item);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function deletePost() {
    setDeleteModal(false);
    if (deletingPost) {
      axios.delete(`/posts/${deletingPost.id}`).then(() => {
        getPosts();
      });
    }
  }

  return (
    <>
      <ButtonBar>
        <Link href="/posts/create">
          <Button
            variant="outlined"
            endIcon={<AddIcon />}
            sx={{ margin: "10px" }}
          >
            Add
          </Button>
        </Link>
      </ButtonBar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Content</TableCell>
              {currentUser?.role === "admin" && (
                <TableCell align="center">User</TableCell>
              )}
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length ? (
              <>
                {posts.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{item.title}</TableCell>
                    <TableCell align="center">{item.content}</TableCell>
                    {currentUser?.role === "admin" && (
                      <TableCell align="center">
                        {item.user?.firstname + " " + item.user?.lastname}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Link href={`/posts/${item.id}`}>
                        <IconButton aria-label="edit" size="large">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleDelete(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Posts
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[1, 5, 10, 25]}
        component="div"
        count={props.count}
        rowsPerPage={paginationState.perPage}
        page={paginationState.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePerPage}
      />
      <ConfirmModal
        open={deleteModal}
        text="Do you agree with deleting this post?"
        closeModal={closeDeleteModal}
        clickOk={deletePost}
      />
    </>
  );
};

export default PostIndex;
