import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { InitReportApi, ProfitLossReportApi } from 'apis/Reports';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { apiErrorSnackBar } from 'utils/SnackBar';
import CenterDialog from 'views/utilities/CenterDialog';
import GenerateForm from './GenerateForm';
import ReportPage from './ReportPage';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const Index = () => {
    const { company, recall } = useAuth();
    const [openGenerate, setOpenGenerate] = useState(false);
    const [reportData, setReportData] = useState({});
    const [initData, setInitData] = useState({});

    const generateReport = () => {
        setOpenGenerate((prevState) => !prevState);
    };

    const generateExportReport = () => {
        const values = {
            company_id: reportData.company_id,
            start_date: moment(reportData.start_date).format('YYYY-MM-DD'),
            end_date: moment(reportData.end_date).format('YYYY-MM-DD'),
            type: 'report'
        };

        ProfitLossReportApi(values)
            .then((res) => {
                const a = document.createElement('a');
                a.href = res.data.data.profit_loss;
                a.download = res.data.data.profit_loss_name;
                a.click();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const submitHandler = () => {
        setOpenGenerate((prevState) => !prevState);
    };

    useEffect(() => {
        InitReportApi()
            .then((res) => {
                setInitData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    }, []);

    useEffect(() => {
        const values = {
            company_id: company.company_id,
            start_date: moment(company.start_date).format('YYYY-MM-DD'),
            end_date: moment(company.end_date).format('YYYY-MM-DD')
        };

        ProfitLossReportApi(values)
            .then((res) => {
                setReportData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    }, [recall]);

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -3 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Profit Loss Report</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" onClick={() => generateExportReport()}>
                                        <FileUploadOutlinedIcon sx={{ mr: 0.5 }} /> Export
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" onClick={() => generateReport()}>
                                        <AddCircleOutlineOutlined sx={{ mr: 0.5 }} /> Generate Report
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                content={true}
            >
                {Object.keys(reportData).length > 0 ? (
                    <ReportPage reportData={reportData} />
                ) : (
                    <Box component="span">
                        <Typography
                            variant="h2"
                            textAlign="center"
                            sx={{
                                p: '10%'
                            }}
                            color="GrayText"
                        >
                            Please Generate Report
                        </Typography>
                    </Box>
                )}
            </MainCard>
            {openGenerate && (
                <CenterDialog
                    title={`Generate Profit Loss Report`}
                    open={openGenerate}
                    onClose={() => setOpenGenerate((prevState) => !prevState)}
                    id="generateForm"
                >
                    <GenerateForm
                        value={reportData}
                        formID="generateForm"
                        initData={initData}
                        setReportData={setReportData}
                        onSubmit={submitHandler}
                    />
                </CenterDialog>
            )}
        </>
    );
};

export default Index;
