import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import * as React from "react";

export default function Help() {
  return (
    <Box style={{ marginLeft: "74px", marginTop: "16px", marginRight: "8px" }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Typography variant="h4">Dissertation 2022</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Typography variant="h4">University of Bucharest</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Typography variant="h4">Made by Delia Chirigiu</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Typography variant="h4">
                Contact: delia.chirigiu@s.unibuc.ro
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
