import React from 'react';
import Button from '@material-ui/core/Button';
import UserRoles from './userRolesDialogue';

const roles = ['System Administrator', 'Account Receivables','General Users'];

export default function Users() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(roles[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
       Roles
      </Button>
          <UserRoles selectedValue={selectedValue} open={open} onClose={handleClose} roles={roles} />
    </div>
  );
}
