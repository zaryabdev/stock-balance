const generatePDF = () => {
  // initialize jsPDF
  const doc = new jsPDF();

  let tickets = [
    {
      id: '123456789',
      title: 'Title',
    },
    {
      id: '0987654',
      title: 'oiuytre',
    },
  ];

  // define the columns we want and their titles
  const tableColumn = ['Id', 'Title'];
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  tickets.forEach((ticket) => {
    const ticketData = [ticket.id, ticket.title];
    // push each tickcet's info into a row
    tableRows.push(ticketData);
  });

  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(' ');
  // we use a date string to generate our filename.
  // const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  doc.text('Closed tickets within the last one month.', 14, 15);
  // we define the name of our PDF file.
  doc.save(`sample_2.pdf`);
};
