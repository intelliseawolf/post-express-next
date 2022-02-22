import { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
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
  Checkbox,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

import ConfirmModal from "../../components/confirmModal";
import { handleAuthSSR, setTokenToHeader } from "../../utils/auth";
import { User } from "../../interfaces/user.interface";
import { useAppSelector } from "../../store/hooks";

interface UserIndexProps {
  users: User[];
  count: number;
  error?: any;
}

interface PaginationState {
  perPage: number;
  page: number;
}

const ButtonBar = styled("div")(() => ({
  display: "flex",
  justifyContent: "end",
}));

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await handleAuthSSR(context, "admin");
    const axios = setTokenToHeader(context);
    const response = await axios.get("/users", {
      params: {
        perPage: context.query.perPage || 5,
        page: context.query.page || 0,
      },
    });

    return {
      props: { users: response.data.users, count: Number(response.data.count) },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { users: [], count: 0 },
    };
  }
};

const UserIndex = (props: UserIndexProps) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(props.users);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [approvingUser, setApprovingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    perPage: Number(router.query.perPage) || 5,
    page: Number(router.query.page) || 0,
  });
  const { currentUser } = useAppSelector((state) => state.auth);

  function handleChangeStatus(item: User) {
    setApproveModal(true);
    setApprovingUser(item);
  }

  function handleDelete(item: User) {
    setDeleteModal(true);
    setDeletingUser(item);
  }

  function closeApproveModal() {
    setApproveModal(false);
  }

  function approveUser() {
    setApproveModal(false);
    if (approvingUser) {
      axios.patch(`/users/${approvingUser.id}/toggleStatus`).then(() => {
        getUsers();
      });
    }
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function deleteUser() {
    setDeleteModal(false);
    if (deletingUser) {
      axios.delete(`/users/${deletingUser.id}`).then(() => {
        getUsers();
      });
    }
  }

  function getUsers(pagination: PaginationState = paginationState) {
    axios
      .get("/users", {
        params: {
          perPage: pagination.perPage || 5,
          page: pagination.page || 0,
        },
      })
      .then(({ data }) => {
        setUsers(data.users);
      });
  }

  function handleChangePage(event: unknown, newPage: number) {
    setPaginationState({
      ...paginationState,
      page: newPage,
    });
    getUsersByPagination(newPage, paginationState.perPage);
  }

  function handleChangePerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setPaginationState({
      page: 0,
      perPage: parseInt(event.target.value, 10),
    });
    getUsersByPagination(0, parseInt(event.target.value, 10));
  }

  function getUsersByPagination(page: number, perPage: number) {
    router.push({
      pathname: "/users",
      query: {
        perPage: perPage,
        page: page,
      },
    });
    getUsers({
      perPage: perPage,
      page: page,
    });
  }

  return (
    <>
      <ButtonBar>
        <Link href="/users/create">
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
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Approved</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length ? (
              <>
                {users.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{item.email}</TableCell>
                    <TableCell align="center">
                      {item.firstname + " " + item.lastname}
                    </TableCell>
                    <TableCell align="center">{item.role}</TableCell>
                    <TableCell align="center">
                      {currentUser?.id !== item.id && (
                        <Checkbox
                          checked={item.status}
                          onChange={() => handleChangeStatus(item)}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {currentUser?.id !== item.id && (
                        <>
                          <Link href={`/users/${item.id}`}>
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
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Users
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
        open={approveModal}
        text={
          "Do you agree with " +
          (approvingUser?.status ? "disapproving" : "approving") +
          " this user?"
        }
        closeModal={closeApproveModal}
        clickOk={approveUser}
      />
      <ConfirmModal
        open={deleteModal}
        text="Do you agree with deleting this user?"
        closeModal={closeDeleteModal}
        clickOk={deleteUser}
      />
    </>
  );
};

export default UserIndex;
