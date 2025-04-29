import {useContext, useState, useCallback, useEffect} from 'react';
import {Box, Typography, Tabs, Tab, Stack} from "@mui/material";
import {i18nContext} from "pithekos-lib";
import SingleBook from "./components/SingleBook";
import Parallel from "./components/Parallel";

function App() {
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 64);
    const [tabNo, setTabNo] = useState(1);
    const handleWindowResize = useCallback(event => {
        setMaxWindowHeight(window.innerHeight - 64);
    }, []);
    const {i18nRef} = useContext(i18nContext);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    function TabPanel(props) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{p: 3}}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setTabNo(newValue);
    };

    return (
        <Stack
            direction="row"
            gap={2}
            sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex', maxHeight: maxWindowHeight}}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabNo}
                onChange={handleChange}
                aria-label="Parallel Gospel Tabs"
                sx={{borderRight: 1, borderColor: 'divider', minWidth: "10em"}}
            >
                <Tab label="MAT" {...a11yProps(0)} />
                <Tab label="MRK" {...a11yProps(1)} />
                <Tab label="LUK" {...a11yProps(2)} />
                <Tab label="JHN" {...a11yProps(3)} />
                <Tab label="|||||" {...a11yProps(4)} />
            </Tabs>
            <TabPanel value={tabNo} index={0}>
                <SingleBook src="MAT"/>
            </TabPanel>
            <TabPanel value={tabNo} index={1}>
                <SingleBook src="MRK"/>
            </TabPanel>
            <TabPanel value={tabNo} index={2}>
                <SingleBook src="LUK"/>
            </TabPanel>
            <TabPanel value={tabNo} index={3}>
                <SingleBook src="JHN"/>
            </TabPanel>
            <TabPanel value={tabNo} index={4}>
                <Parallel srcSpec={[
                    ["MAT", "MAT.json"],
                    ["MRK", "MRK.json"],
                    ["LUK", "LUK.json"],
                    ["JHN", "JHN.json"],
                ]}/>
            </TabPanel>
        </Stack>
    );
}

export default App;
