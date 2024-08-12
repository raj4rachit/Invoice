import { useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useState } from 'react';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import ReportPage from './ReportPage';
import { ClientStatementApi, InitClientsApi } from 'apis/Reports';
import { apiErrorSnackBar } from 'utils/SnackBar';
import CenterDialog from 'views/utilities/CenterDialog';
import GenerateForm from './GenerateForm';
import useAuth from 'hooks/useAuth';
import moment from 'moment';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const Index = () => {
    const { company, recall } = useAuth();
    const [openGenerate, setOpenGenerate] = useState(false);
    const [reportData, setReportData] = useState({});
    const [initData, setInitData] = useState([]);

    const generateReport = () => {
        setOpenGenerate((prevState) => !prevState);
    };

    const generateExportReport = () => {
        const values = {
            client_id: reportData.client_id,
            start_date: moment(reportData.start_date).format('YYYY-MM-DD'),
            end_date: moment(reportData.end_date).format('YYYY-MM-DD'),
            type: 'report'
        };

        ClientStatementApi(values)
            .then((res) => {
                const a = document.createElement('a');
                a.href = res.data.data.client_report;
                a.download = res.data.data.client_report_name;
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
        const values = {
            client_id: '0',
            start_date: moment(company.start_date).format('YYYY-MM-DD'),
            end_date: moment(company.end_date).format('YYYY-MM-DD')
        };

        ClientStatementApi(values)
            .then((res) => {
                setReportData(res.data.data);
            })
            .catch((err) => {
                apiErrorSnackBar(err);
            });
    }, [recall]);

    useEffect(() => {
        InitClientsApi()
            .then((res) => {
                setInitData(res.data.data);
            })
            .catch(() => {
                apiErrorSnackBar(err);
            });
    }, []);

    return (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" spacing={gridSpacing} sx={{ mb: -1, mt: -3 }}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography variant="column">Client Report</Typography>
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
                    title={`Generate Income Statement Report`}
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
