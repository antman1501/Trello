import { Box } from '@mui/material'
import React from 'react'
import ReactLoading from 'react-loading'

const LoadingScreen = () => {
  return (
    <Box>
        <ReactLoading type='spin' color='black' height='10vh' width='10vw'></ReactLoading>
        <Box>Loading</Box>
    </Box>
  )
}

export default LoadingScreen