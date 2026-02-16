// components/pdf/PDFInvoice.js
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


// EXPLANATION: PDF styles (similar to CSS but limited)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  businessInfo: {
    fontSize: 9,
    color: '#666'
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 5
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 8,
    color: '#999',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  clientInfo: {
    fontSize: 10
  },
  table: {
    marginTop: 20,
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 8,
    marginBottom: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8
  },
  tableCol1: {
    width: '50%'
  },
  tableCol2: {
    width: '15%',
    textAlign: 'right'
  },
  tableCol3: {
    width: '20%',
    textAlign: 'right'
  },
  tableCol4: {
    width: '25%',
    textAlign: 'right'
  },
  totals: {
    marginLeft: 'auto',
    width: '40%',
    marginTop: 20
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 10
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginTop: 8
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  notes: {
    marginTop: 30,
    fontSize: 9,
    color: '#666'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999'
  }
});

export default function PDFInvoice({ invoice, businessInfo}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {businessInfo.logoUrl && (
              <Image 
                src={businessInfo.logoUrl} 
                style={styles.logo}
                cache={false}
                alt="Business logo"
              />
            )}
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              {businessInfo.businessName}
            </Text>
            <View style={styles.businessInfo}>
              {businessInfo.businessEmail && (
                <Text>{businessInfo.businessEmail}</Text>
              )}
              {businessInfo.businessPhone && (
                <Text>{businessInfo.businessPhone}</Text>
              )}
              {businessInfo.businessAddress && (
                <Text>{businessInfo.businessAddress}</Text>
              )}
            </View>
          </View>

          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill To & Dates */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <View style={styles.clientInfo}>
              <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                {invoice.clientName}
              </Text>
              {invoice.clientEmail && <Text>{invoice.clientEmail}</Text>}
              {invoice.clientAddress && <Text>{invoice.clientAddress}</Text>}
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.sectionTitle}>Issue Date</Text>
              <Text>{invoice.issueDate}</Text>
            </View>
            <View>
              <Text style={styles.sectionTitle}>Due Date</Text>
              <Text>{invoice.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol1, { fontWeight: 'bold' }]}>Description</Text>
            <Text style={[styles.tableCol2, { fontWeight: 'bold' }]}>Qty</Text>
            <Text style={[styles.tableCol3, { fontWeight: 'bold' }]}>Rate</Text>
            <Text style={[styles.tableCol4, { fontWeight: 'bold' }]}>Amount</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{item.description}</Text>
              <Text style={styles.tableCol2}>{item.quantity}</Text>
              <Text style={styles.tableCol3}>${item.rate.toFixed(2)}</Text>
              <Text style={styles.tableCol4}>${item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>${invoice.subtotal.toFixed(2)}</Text>
          </View>

          {invoice.discountPercent > 0 && (
            <View style={styles.totalRow}>
              <Text>Discount ({invoice.discountPercent}%)</Text>
              <Text>-${invoice.discountAmount.toFixed(2)}</Text>
            </View>
          )}

          {invoice.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text>Tax ({invoice.taxRate}%)</Text>
              <Text>${invoice.taxAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.totalRow, styles.totalLine]}>
            <Text style={{ fontWeight: 'bold' }}>Total</Text>
            <Text style={styles.totalAmount}>${invoice.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}