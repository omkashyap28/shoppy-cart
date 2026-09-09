"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import type { Invoice } from "@/types/invoice";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#222",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  brand: {
    fontSize: 22,
    fontWeight: "bold",
  },

  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  muted: {
    color: "#666",
    fontSize: 9,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },

  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  column: {
    width: "48%",
  },

  text: {
    marginBottom: 3,
  },

  table: {
    borderWidth: 1,
    borderColor: "#ddd",
  },

  tableHeader: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  tableRow: {
    flexDirection: "row",
    padding: 8,
  },

  description: {
    width: "55%",
  },

  quantity: {
    width: "15%",
    textAlign: "center",
  },

  amount: {
    width: "30%",
    textAlign: "right",
  },

  total: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  totalText: {
    fontSize: 13,
    fontWeight: "bold",
  },

  payment: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#eee",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#777",
  },
});

function formatAddress(address: Invoice["address"]) {
  if (!address) return "";

  return Object.values(address)
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== "",
    )
    .join(", ");
}

interface InvoiceDocumentProps {
  invoice: Invoice;
}

export function InvoiceDocument({
  invoice,
}: InvoiceDocumentProps) {
  return (
    <Document
      title={`Invoice ${invoice.invoiceNo}`}
      author="Shoppy Cart"
      subject={`Order ${invoice.orderId}`}
    >
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Shoppy Cart</Text>
            <Text style={styles.muted}>
              Online Shopping Platform
            </Text>
          </View>

          <View>
            <Text style={styles.invoiceTitle}>
              INVOICE
            </Text>

            <Text style={styles.muted}>
              #{invoice.invoiceNo}
            </Text>
          </View>
        </View>

        {/* Buyer / Seller */}
        <View style={styles.section}>
          <View style={styles.columns}>

            <View style={styles.column}>
              <Text style={styles.sectionTitle}>
                BILL TO
              </Text>

              <Text style={styles.text}>
                {invoice.buyerName}
              </Text>

              <Text style={styles.text}>
                {invoice.buyerEmail}
              </Text>

              <Text style={styles.muted}>
                {formatAddress(invoice.address)}
              </Text>
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionTitle}>
                SELLER
              </Text>

              <Text style={styles.text}>
                {invoice.seller}
              </Text>

              <Text style={styles.muted}>
                {formatAddress(invoice.shopAddress)}
              </Text>
            </View>

          </View>
        </View>

        {/* Order */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ORDER DETAILS
          </Text>

          <View style={styles.table}>

            <View style={styles.tableHeader}>
              <Text style={styles.description}>
                Description
              </Text>

              <Text style={styles.quantity}>
                Qty
              </Text>

              <Text style={styles.amount}>
                Amount
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.description}>
                {invoice.productDescription}
              </Text>

              <Text style={styles.quantity}>
                {invoice.quantity}
              </Text>

              <Text style={styles.amount}>
                ₹{invoice.amount}
              </Text>
            </View>

          </View>

          <View style={styles.total}>
            <Text style={styles.totalText}>
              Total: ₹{invoice.amount}
            </Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            PAYMENT INFORMATION
          </Text>

          <View style={styles.payment}>

            <Text style={styles.text}>
              Payment Method: {invoice.paymentMethod}
            </Text>

            <Text style={styles.text}>
              Payment ID: {invoice.paymentId}
            </Text>

            <Text style={styles.text}>
              Transaction ID: {invoice.transactionId}
            </Text>

            <Text style={styles.text}>
              Order ID: {invoice.orderId}
            </Text>

          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for shopping with Shoppy Cart.
        </Text>

      </Page>
    </Document>
  );
}