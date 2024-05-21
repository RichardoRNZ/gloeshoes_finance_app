import { Backdrop, Button, CircularProgress } from '@mui/material';
import React, {useState} from 'react'

const Loading = (props) => {



    return (
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={props.isLoading}
        //   onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
}

export default Loading

