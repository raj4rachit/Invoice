import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { InitIncomeStatementApi, YOYReportApi } from 'apis/Reports';
import useAuth from 'hooks/useAuth';
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
            financial_years: reportData.financial_ids,
            type: 'report'
        };

        YOYReportApi(values)
            .then((res) => {
                const a = document.createElement('a');
                a.href = res.data.data.yoy_data;
                a.download = res.data.data.yoy_name;
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
        InitIncomeStatementApi()
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
                                    <Typography variant="column">Year over Year Report</Typography>
                                </Grid>
                                {Object.keys(reportData).length > 0 && (
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => generateExportReport()}>
                                            <FileUploadOutlinedIcon sx={{ mr: 0.5 }} /> Export
                                        </Button>
                                    </Grid>
                                )}
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
                {/* <ReportPage reportData={reportData} /> */}
            </MainCard>
            {openGenerate && (
                <CenterDialog
                    title={`Year over Year Report`}
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
