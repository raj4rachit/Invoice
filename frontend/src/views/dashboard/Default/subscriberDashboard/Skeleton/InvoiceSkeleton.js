import { Card, CardContent, Grid, Skeleton } from '@mui/material';
import { gridSpacing } from 'store/constant';

const InvoiceSkeleton = () => (
    <Card>
        <CardContent>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item xs zeroMinWidth>
                            <Skeleton variant="rectangular" height={30} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height={250} />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default InvoiceSkeleton;
