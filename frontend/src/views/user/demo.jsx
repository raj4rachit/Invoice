// import propTypes from 'prop-types';
// import { LockTwoTone, AccountCircleTwoTone } from '@mui/icons-material';
// import { Box, Tab, Tabs } from '@mui/material';
// import { useState } from 'react';
// import UserForm from './UserForm';
// import ChangePassword from './ChangePassword';

// const AddEditUser = ({ value, formId, onSubmit }) => {
//     const [currentTab, setCurrentTab] = useState('profile');
//     const handleChangeTab = (newValue) => {
//         setCurrentTab(newValue);
//     };

//     // const PROFILE_TABS = [
//     //     {
//     //         label: 'Profile',
//     //         value: 'profile',
//     //         icon: <AccountCircleTwoTone fontSize="small" />,
//     //         component: <UserForm formId={formId} />,
//     //         display: 'both'
//     //     },
//     //     {
//     //         label: 'Change Password',
//     //         value: 'change_password',
//     //         icon: <LockTwoTone fontSize="small" />,
//     //         component: <ChangePassword />,
//     //         display: 'edit'
//     //     }
//     // ];

//     return (
//         <>
//             {/* <Tabs
//                 value={currentTab}
//                 scrollButtons="auto"
//                 variant="scrollable"
//                 // allowScrollButtonsMobile
//                 onChange={(e, val) => handleChangeTab(val)}
//                 TabIndicatorProps={{ style: { bottom: '10px' } }}
//                 sx={{ marginTop: '-20px' }}
//             >
//                 {PROFILE_TABS.map((tab) => (
//                     <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} iconPosition="start" />
//                 ))}
//             </Tabs> */}
//             <Box>
//                 {/* {PROFILE_TABS.map((tab) => {
//                     const isMatched = tab.value === currentTab;
//                     return isMatched && <Box key={tab.value}>{tab.component}</Box>;
//                 })} */}
//                 <form id={formId}>
//                     <Grid container justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Username" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8}>
//                                     <TextField fullWidth size="small" id="username" name="username" label="Username" />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Name" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={4}>
//                                     <TextField fullWidth size="small" id="first_name" name="first_name" label="First Name" />
//                                 </Grid>
//                                 <Grid item xs={12} sm={4}>
//                                     <TextField fullWidth size="small" id="last_name" name="last_name" label="Last Name" />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Email" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8}>
//                                     <TextField fullWidth size="small" id="email" name="email" label="Email" />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Password" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8}>
//                                     <TextField fullWidth size="small" id="password" name="password" label="Password" />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Mobile Number" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8}>
//                                     <TextField fullWidth size="small" id="mobile_number" name="mobile_number" label="Mobile Number" />
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Gender" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8}>
//                                     <RadioGroup row name="gender" defaultValue="male">
//                                         <FormControlLabel value="male" control={<Radio />} label="Male" />
//                                         <FormControlLabel value="female" control={<Radio />} label="Female" />
//                                         <FormControlLabel value="other" control={<Radio />} label="Other" />
//                                     </RadioGroup>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Grid container alignItems="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <Typography variant="subtitle1">
//                                         <Required title="Address" />
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8}>
//                                     <Grid container alignItems="center" spacing={2}>
//                                         <Grid item xs={12} sm={12}>
//                                             <TextField
//                                                 fullWidth
//                                                 multiline
//                                                 size="small"
//                                                 rows={4}
//                                                 id="address"
//                                                 name="address"
//                                                 label="Address"
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6}>
//                                             <TextField fullWidth size="small" id="country" name="country" label="Country" />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6}>
//                                             <TextField fullWidth size="small" id="state" name="state" label="State" />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6}>
//                                             <TextField fullWidth size="small" id="city" name="city" label="City" />
//                                         </Grid>
//                                         <Grid item xs={12} sm={6}>
//                                             <TextField fullWidth size="small" id="postcode" name="postcode" label="Postcode" />
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </form>
//             </Box>
//         </>
//     );
// };

// AddEditUser.propTypes = {
//     value: propTypes.object,
//     formId: propTypes.string.isRequired,
//     onSubmit: propTypes.func
// };

// export default AddEditUser;
