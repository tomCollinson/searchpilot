import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Container maxWidth="lg" className="Layout">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Search Pilot
          </Typography>
        </Toolbar>
      </AppBar>
      <Outlet/>
    </Container>
  );
}

export default Layout;