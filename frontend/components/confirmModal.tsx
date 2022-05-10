import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

interface ConfirmModalProps {
  open: boolean;
  text: string;
  closeModal: Function;
  clickOk: Function;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const { open, closeModal, text, clickOk } = props;

  function handleClose() {
    closeModal();
  }

  function handleAgree() {
    clickOk();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleAgree} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
