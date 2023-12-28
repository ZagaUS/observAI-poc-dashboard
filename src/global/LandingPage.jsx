import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box';
import React from 'react'
import Observai from '../assets/observai.png'
import Infra from '../assets/Infra.jpeg'
import Sustainability from '../assets/sustainability.jpeg'
import Admin from '../assets/admin.jpeg'

const LandingPage = () => {

  return (
    <div style={{ margin: "10px" }}>
      <Typography variant="h3" style={{ textAlign: "center", marginBottom: "30px" }}>LandingPage</Typography>

      <Box sx={{ marginBottom: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>

        <Grid container spacing={2} justifyContent="center" textAlign="center" alignItems="center">
          <Grid item xs={8} sm={2} ipadmini={4}>
            <Grid container justifyContent="center">
              <Card elevation={3} >
                <CardMedia
                  sx={{ height: 140 }}
                  image={Observai}
                  title="observability"
                />
                  <CardContent>
                    <Typography variant="h4" >Observability - APM</Typography>
                    <Typography variant="h6" sx={{ textAlign: "justify", fontWeight: "light" }}>
                      Observability is the extent to which you can understand the internal state or condition of a complex system based only on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info">Open Observability</Button>
                  </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Grid item xs={8} sm={2} ipadmini={4}>
            <Grid container justifyContent="center">
              <Card elevation={3}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={Infra}
                    title="observability"
                />
                  <CardContent>
                    <Typography variant="h4">Observability - Infra</Typography>
                    <Typography>
                      Observability is the extent to which you can understand the internal state or condition of a complex system based only on knowledge of its external outputs.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info">Open Observability</Button>
                  </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Grid item xs={8} sm={2} ipadmini={4}>
            <Grid container justifyContent="center">
              <Card elevation={3}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={Sustainability}
                    title="Sustainability"
                  />
                  <CardContent>
                    <Typography variant="h4">Sustainability</Typography>
                    <Typography>
                      Sustainability has become a priority in all aspects of a business, and IT operations is no exception. To manage energy efficiency and be climate-conscious, IT ops teams must look closely at where and what is using the most energy -- and one major offender is Kubernetes clusters.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info">Open Observability</Button>
                  </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Grid item xs={8} sm={2} ipadmini={4}>
            <Grid container justifyContent="center">
              <Card elevation={3}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={Admin}
                    title="Admin"
                  />
                  <CardContent>
                    <Typography variant="h4">Admin</Typography>
                    <Typography>
                      Admin
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="info">Open Observability</Button>
                  </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>

      </Box>

    </div>
  )
}

export default LandingPage
