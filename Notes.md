# Critical Issues :

- Optimize Application
  - Too many messages and events, responses 😟
- Current worth is not 0 even all stock is at 0 [FIXED]
  - Total Worth is 0 but stock is still available [FIXED]
- Double ID gerations ( Add & Delete both )
  - Add validations for DID
  - Add universal validator button for already duplicated records
- Reverse Current Balance formula
- Defalut Value not changing for payment & previous balance
  - Payment make it free entry
  - Payment const change it from none to payment
- When archiving all customer app crashes sometimes

# Isssues :

- When saving an empty record sql throws error [FIXED]
- Add validations to customer creation
- Floating number in print [DONE]
- Customers List Filters
  - All filter not working [FIXED]
  - Un-archive not working [ISSUE] (triggers too many events)
  - Add delete customers
- Change action buttons position [DONE]
- Convert pagination to infinite scroll [DONE]
- Why payment is empty ?
- Convert Dollar Sign to PKR in Report
- Add Walking Customer
  - Add walking customer data grid
  - Add walking customer balance sheet
  - Check change in stock for walking customer

# Features :

- Show All stock sheet on print
- Show date
- Show Checkboxes
- Al Madina Traders
- Add this information to Balnce Sheet and Invoice
  - G#29 , 7 Star Plaza Abkari Road, New Anarkali, Lahore.
  - 042-7112172
  - 0300-9409063
  - 0328-3700010

## Stock

- On stock update show last updated timestamp
- Add clear filters
- Add Global Search
- Add print option
- Add stock worth on Stock Tab

## Balance

-

## Invoice

- Add Tab for invoice history
  - History Table
  - Print

## Dashboard

- Add chart to show last week sales

## Data Grid

- Show all records on print modal
- Add checkboxes for selection of records print
- Add option to print
  - Balance Sheet
  - Invoice

## License

- Add product key encryption
- https://stackoverflow.com/questions/44708242/is-it-possible-to-create-product-keys-for-my-electron-application
- getmac /v /fo list
- Office D4-BE-D9-84-AB-3D

## Usefull links

https://dev.to/maxwelladn/build-a-pdf-invoice-template-using-only-typescript-and-jspdf-autotable-25gn
https://marketsplash.com/tutorials/node-js/node-js-printing/

https://blog.logrocket.com/advanced-electron-js-architecture/

https://stackoverflow.com/questions/599837/how-to-generate-and-validate-a-software-license-key

https://stackoverflow.com/questions/63392147/electron-renderer-process-when-should-i-clean-ipc-listeners

https://blog.logrocket.com/electron-ipc-response-request-architecture-with-typescript/

# Unsorted

- Sort by alphabetical order [DONE]
  - List, Stock, Balance
- By default open each grid at last scroll level [ISSUE] [Onlu works on first tab]
- Add date range to print

## Walking Customer

- Add module for walking customer
