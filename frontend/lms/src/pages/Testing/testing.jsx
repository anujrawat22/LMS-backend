function AllFormData({ allData, onDeleteFormDataById, onHandleUpdateForm, onLoadFormDataAgain }) {
    const columns = [
        {
            field: 'view',
            headerName: 'View',
            width: 70,
            renderCell: (params) => {
                return (
                    <TableCell>
                        <VisibilityIcon
                            sx={{ fontSize: "18px" }}
                            onClick={() => {
                                setOpenViewDialog(true);
                                handleViewDataObject(params.row._id);
                            }}
                        />
                    </TableCell>
                )
            },
            cellClassName: 'centered-cell',
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 70,
            sortable: false,
            filterable: false,
            toolbar: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <TableCell>
                        <EditIcon
                            sx={{ fontSize: "18px" }}
                            onClick={() => handleEditClick(params.row.id, params.row._id)}
                        />
                    </TableCell>
                );
            },
            cellClassName: 'centered-cell',
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 70,
            renderCell: (params) => {
                return (
                    <TableCell>
                        <DeleteIcon
                            sx={{ fontSize: "18px" }}
                            onClick={() => {
                                const id = params.row._id;
                                handleDelete(id);
                            }}
                        />
                    </TableCell>
                )
            },
            cellClassName: 'centered-cell',
        },
        {
            field: 'id', headerName: 'ID', width: 70, headerClassName: "header-bg-color", cellClassName: 'centered-cell',
        },
        { field: 'startDate', headerName: 'Start Date', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'day', headerName: 'Week Day', width: 100, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'every', headerName: 'Every (day/week/month/year)', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'repeatson', headerName: 'Selected Week', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'month', headerName: 'Month', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'frequency', headerName: 'Frequency', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'skipholidays', headerName: 'Skipped Holidays', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'sendtime', headerName: 'Send Time', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'name', headerName: 'Name', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'company', headerName: 'Company', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'isActiveWA', headerName: 'WhatsApp Activate', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'waMessage', headerName: 'WhatsApp Message', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        {
            field: 'WaAttachement',
            headerName: 'Whatsapp Attachments',
            width: 200,
            renderCell: (params) => {
                const attachmentUrls = params.value || [];
                return (
                    <TableCell>
                        {attachmentUrls.map((url, index) => (
                            <div key={index}>
                                <a href={url} target="_blank">
                                    Click Here
                                </a>
                                {
                                    index < attachmentUrls.length - 1 ? <span>,</span> : <></>
                                }
                            </div>
                        ))}
                    </TableCell>
                );
            },
            cellClassName: 'centered-cell',
            headerClassName: 'centered-header'
        },
        { field: 'mobile', headerName: 'WhatsApp Phone', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'isActiveEmail', headerName: 'Email Activate', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'email', headerName: 'Email ID', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'cc', headerName: 'Email Cc', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'bcc', headerName: 'Email Bcc', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'emailSubject', headerName: 'Email Subject', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'emailBody', headerName: 'Email Body', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        {
            field: 'emailAttachment',
            headerName: 'Email Attachment',
            width: 200,
            renderCell: (params) => {
                const attachmentUrls = params.value || [];
                return (
                    <TableCell>
                        {attachmentUrls.map((url, index) => (
                            <div key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    Click Here
                                </a>
                                {
                                    index < attachmentUrls.length - 1 ? <span>,</span> : <></>
                                }
                            </div>
                        ))}
                    </TableCell>
                );
            },
            cellClassName: 'centered-cell',
            headerClassName: 'centered-header'
        },
        { field: 'endDate', headerName: 'End Date', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: '_id', headerName: 'Unique Id', width: 100, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
    ];

    const rows = allFormData.map((item, index) => {
        let formattedEndDate = '';
        if (item.endDate) {
            formattedEndDate = (() => {
                if (item.endDate?.date) {
                    return `DATE - ${item.endDate?.date}`;
                } else if (item.endDate?.occurence > 0) {
                    return `OCCURENCE - ${item.endDate?.occurence}`;
                } else if (item.endDate?.never === 'never') {
                    return 'NEVER';
                } else {
                    return '';
                }
            })();
        }
        let formattedMonth = '';
        if (item.month) {
            formattedMonth = (() => {
                if (item.month.date) {
                    return item.month.date;
                } else if (item.month.day) {
                    return item.month.day;
                }
            })()
        }
        return {
            id: index,
            startDate: formatDateToIndianTime(item.startDate),
            day: item.day,
            every: item.every,
            repeatson: item?.week?.days.join(",") ?? '',
            month: formattedMonth,
            frequency: item.frequency,
            skipholidays: item.skipHolidays,
            sendtime: item.sendTime,
            name: item.name,
            company: item.company,
            isActiveWA: String(item.isActiveWA),
            waMessage: item.waMessage,
            WaAttachement: item.WaAttachement,
            mobile: item.mobile,
            isActiveEmail: item.isActiveEmail,
            email: item.email,
            cc: item.cc?.join(','),
            bcc: item.bcc?.join(','),
            emailSubject: item.emailSubject,
            emailBody: item.emailBody,
            emailAttachment: item.emailAttachments,
            endDate: formattedEndDate,
            _id: item._id,
        }
    });

    const handleDelete = async (_id) => {
        onDeleteFormDataById(_id);
    }

    const formateMonthDate = (month) => {
        let formattedMonth = '';
        if (month) {
            formattedMonth = (() => {
                if (month.date) {
                    return month.date;
                } else if (month.day) {
                    return month.day;
                }
            })();
        }
        return formattedMonth;
    }

    const formateEndDate = (endDate) => {
        if (endDate?.date) {
            return `DATE - ${endDate?.date}`;
        } else if (endDate?.occurence > 0) {
            return `OCCURENCE - ${endDate?.occurence}`;
        } else if (endDate?.never === 'never') {
            return 'NEVER';
        } else {
            return '';
        }
    }

    const ClickHereLinks = ({ links }) => {
        return <>
            {
                links.map((link, index) => {
                    if (index === links.length - 1) {
                        return <span><a href={link}>Click Here</a></span>;
                    }
                    return <><span><a href={link}>Click Here</a></span><span>,</span></>
                })
            }
        </>
    }

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{ mt: 8, ml: 3, textAlign: 'center', justifyContent: 'center', alignItems: 'center', width: "98%" }}
            >
                <Grid item xs={12} sm={11.5}>
                    <Paper elevation={10} sx={{ padding: "10px" }}>
                        <DataGrid
                            disableSelectionOnClick={true}
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            className="header-bg-color"
                            style={{ fontFamily: "roboto" }}
                            slots={{
                                toolbar: GridToolbar,
                            }}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                        _id: false,
                                    },
                                },
                            }}
                            stickyHeader
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default AllFormData;




