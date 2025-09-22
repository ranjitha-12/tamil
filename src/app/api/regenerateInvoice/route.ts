import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Student from "@/models/studentModel";
import Parent from "@/models/parent";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }
    
    // Find student with this transaction
    const student = await Student.findOne({
      "paymentHistory.transactionId": transactionId
    });
    
    if (!student) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }
    
    // Find the specific payment record
    const paymentRecord = student.paymentHistory.find(
      (payment: any) => payment.transactionId === transactionId
    );
    
    if (!paymentRecord) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }
    
    const parent = await Parent.findById(student.parent);
    if (!parent) {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      );
    }

    // Extract payment details from the record
    const { amount, currency, paidAt, paymentMethod } = paymentRecord;
    const normalizedCurrency = typeof currency === "string" ? currency.toUpperCase() : currency;

    const billingDetails = {
      name: `${parent.fatherFirstName} ${parent.fatherLastName} & ${parent.motherFirstName} ${parent.motherLastName}`,
      email: parent.email,
      phone: parent.whatsapp,
      address: {
        line1: parent.address?.street || "",
        city: parent.address?.city || "",
        state: parent.address?.state || "",
        postal_code: parent.address?.postalCode || "",
        country: parent.address?.country || parent.country,
      },
    };
    
    // Generate professional invoice PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); 
    
    // Modern color palette
    const primaryColor = rgb(30 / 255, 35 / 255, 93 / 255); 
    const accentColor = rgb(0.8, 0.1, 0.1); 
    const lightGray = rgb(0.96, 0.96, 0.96);
    const mediumGray = rgb(0.8, 0.8, 0.8);
    const textColor = rgb(0.2, 0.2, 0.2);
    const white = rgb(1, 1, 1);
    
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Header with gradient effect
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: primaryColor,
    });
    
    // Logo/Company name
    page.drawText("UNIVERSAL TAMIL ACADEMY", {
      x: 50,
      y: height - 60,
      size: 20,
      font: boldFont,
      color: white,
    });
    
    page.drawText("Empowering Tamil Language Education Worldwide", {
      x: 50,
      y: height - 85,
      size: 10,
      font: font,
      color: white,
    });
    
    // Website and address (removed emoji to fix encoding error)
    page.drawText("www.universaltamilacademy.org", {
      x: 50,
      y: height - 100,
      size: 9,
      font: font,
      color: white,
    });
    
    page.drawText("Tamtree India Private Limited, Paramathi-Velur, Tamil Nadu", {
      x: 50,
      y: height - 112,
      size: 9,
      font: font,
      color: white,
    });
    
    // Invoice badge
    page.drawRectangle({
      x: width - 150,
      y: height - 70,
      width: 100,
      height: 40,
      color: white,
      borderColor: white,
      borderWidth: 1,
    });
    
    page.drawText("INVOICE", {
      x: width - 140,
      y: height - 50,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    // Separator line
    page.drawLine({
      start: { x: 50, y: height - 130 },
      end: { x: width - 50, y: height - 130 },
      thickness: 1,
      color: mediumGray,
    });
    
    // Billed to section
    const detailsY = height - 170;
    
    page.drawText("BILLED TO:", {
      x: 50,
      y: detailsY,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    page.drawText(billingDetails.name, {
      x: 50,
      y: detailsY - 20,
      size: 11,
      font: font,
      color: textColor,
    });
    
    page.drawText(billingDetails.email, {
      x: 50,
      y: detailsY - 35,
      size: 10,
      font: font,
      color: textColor,
    });
    
    page.drawText(billingDetails.phone, {
      x: 50,
      y: detailsY - 50,
      size: 10,
      font: font,
      color: textColor,
    });

    page.drawText(billingDetails.address.line1, {
      x: 50,
      y: detailsY - 65,
      size: 10,
      font: font,
      color: textColor,
    });
    
    page.drawText(`${billingDetails.address.city}, ${billingDetails.address.state}`, {
      x: 50,
      y: detailsY - 80,
      size: 10,
      font: font,
      color: textColor,
    });
    
    page.drawText(`${billingDetails.address.country}, ${billingDetails.address.postal_code}`, {
      x: 50,
      y: detailsY - 95,
      size: 10,
      font: font,
      color: textColor,
    });
    
    // Invoice details
    page.drawText("INVOICE DETAILS:", {
      x: width - 250,
      y: detailsY,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    // Generate a proper invoice number (UTA-YYYY-NNN)
    const year = new Date().getFullYear();
    const invoiceNumber = `UTA-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    page.drawText(`Invoice #: ${invoiceNumber}`, {
      x: width - 250,
      y: detailsY - 20,
      size: 10,
      font: font,
      color: textColor,
    });
    
    const paidDate = paidAt ? new Date(paidAt) : new Date();
    page.drawText(`Date: ${paidDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    {
    x: width - 250,
    y: detailsY - 35,
    size: 10,
    font: font,
    color: textColor,
    });
    
    page.drawText(`Status: Paid`, {
      x: width - 250,
      y: detailsY - 50,
      size: 10,
      font: boldFont,
      color: accentColor,
    });
    
    const safePaymentMethod =
  typeof paymentMethod === "string" && paymentMethod.length > 0
    ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)
    : "N/A";

    page.drawText(`Method: ${safePaymentMethod}`, {
      x: width - 250,
      y: detailsY - 65,
      size: 10,
      font: font,
      color: textColor,
    });
    
    page.drawText(`Transaction ID: ${transactionId}`, {
      x: width - 250,
      y: detailsY - 80,
      size: 10,
      font: font,
      color: textColor,
    });
    
    // Separator line
    page.drawLine({
      start: { x: 50, y: detailsY - 110 },
      end: { x: width - 50, y: detailsY - 110 },
      thickness: 1,
      color: mediumGray,
    });
    
    // Student details section
    const studentDetailsY = detailsY - 130;
    
    page.drawText("STUDENT INFORMATION:", {
      x: 50,
      y: studentDetailsY,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    // Safely access student ID (handle case where it might not exist)
    const studentId = student._id || `UTA-STU-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    page.drawText(`Name: ${student.name} ${student.surname}`, {
      x: 50,
      y: studentDetailsY - 20,
      size: 11,
      font: font,
      color: textColor,
    });
    
    page.drawText(`Student ID: ${studentId}`, {
      x: 50,
      y: studentDetailsY - 35,
      size: 11,
      font: font,
      color: textColor,
    });
    
    page.drawText(`Grade: ${(student as any).tamilGrade || "Basic"}`, {
      x: 50,
      y: studentDetailsY - 50,
      size: 11,
      font: font,
      color: textColor,
    });
    
    if ((student as any).planStartDate && (student as any).planEndDate) {
      page.drawText(`Plan Period: ${new Date((student as any).planStartDate).toLocaleDateString()} - ${new Date((student as any).planEndDate).toLocaleDateString()}`, {
        x: 50,
        y: studentDetailsY - 65,
        size: 11,
        font: font,
        color: textColor,
      });
    }
    
    // Separator line
    page.drawLine({
      start: { x: 50, y: studentDetailsY - 85 },
      end: { x: width - 50, y: studentDetailsY - 85 },
      thickness: 1,
      color: mediumGray,
    });
    
    // Items table
    const tableY = studentDetailsY - 105;
    
    // Table header
    page.drawRectangle({
      x: 50,
      y: tableY,
      width: width - 100,
      height: 30,
      color: primaryColor,
    });
    
    // Define column positions with better spacing
    const descriptionX = 60;
    const qtyX = width - 240; // Adjusted left
    const unitPriceX = width - 190; // Adjusted left
    const amountX = width - 110; // Adjusted left
    
    page.drawText("DESCRIPTION", {
      x: descriptionX,
      y: tableY + 10,
      size: 12,
      font: boldFont,
      color: white,
    });
    
    page.drawText("QTY", {
      x: qtyX,
      y: tableY + 10,
      size: 12,
      font: boldFont,
      color: white,
    });
    
    page.drawText("UNIT PRICE", {
      x: unitPriceX,
      y: tableY + 10,
      size: 12,
      font: boldFont,
      color: white,
    });
    
    page.drawText("AMOUNT", {
      x: amountX,
      y: tableY + 10,
      size: 12,
      font: boldFont,
      color: white,
    });
    
    // Table row
    page.drawRectangle({
      x: 50,
      y: tableY - 30,
      width: width - 100,
      height: 30,
      color: lightGray,
    });
    
    page.drawText("Tamil Language Course - " + ((student as any).selectedPlan || "Basic"), {
      x: descriptionX,
      y: tableY - 20,
      size: 11,
      font: font,
      color: textColor,
      maxWidth: qtyX - descriptionX - 10, 
    });
    
    page.drawText("1", {
      x: qtyX,
      y: tableY - 20,
      size: 11,
      font: font,
      color: textColor,
    });
    
    page.drawText(`${amount} ${normalizedCurrency}`, {
      x: unitPriceX,
      y: tableY - 20,
      size: 11,
      font: font,
      color: textColor,
    });
    
    page.drawText(`${amount} ${normalizedCurrency}`, {
      x: amountX,
      y: tableY - 20,
      size: 11,
      font: font,
      color: textColor,
    });
    
    // Total row
    page.drawRectangle({
      x: 50,
      y: tableY - 60,
      width: width - 100,
      height: 30,
      color: mediumGray,
    });
    
    page.drawText("TOTAL", {
      x: descriptionX,
      y: tableY - 50,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`${amount} ${normalizedCurrency}`, {
      x: amountX,
      y: tableY - 50,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    // Separator line
    page.drawLine({
      start: { x: 50, y: tableY - 80 },
      end: { x: width - 50, y: tableY - 80 },
      thickness: 1,
      color: mediumGray,
    });
    
    // Notes/Terms section
    const notesY = tableY - 100;
    
    page.drawText("NOTES / TERMS:", {
      x: 50,
      y: notesY,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    
    const terms = [
      "Fees are non-refundable once the course begins.",
      "Payment confirmation is subject to clearance by the bank.",
      "Please quote your Invoice Number and Student ID for any queries."
    ];
    
    terms.forEach((term, index) => {
      page.drawText(term, {
        x: 50,
        y: notesY - 20 - (index * 15),
        size: 10,
        font: font,
        color: textColor,
      });
    });
    
    // Authorized signatory - placed above footer
    const signatoryY = 140;
    
    page.drawText("AUTHORIZED SIGNATORY", {
      x: width - 250,
      y: signatoryY,
      size: 11,
      font: boldFont,
      color: primaryColor,
    });
    
    page.drawLine({
      start: { x: width - 250, y: signatoryY - 5 },
      end: { x: width - 100, y: signatoryY - 5 },
      thickness: 1,
      color: mediumGray,
    });
    
    page.drawText("(Signature / Seal)", {
      x: width - 240,
      y: signatoryY - 20,
      size: 10,
      font: font,
      color: mediumGray,
    });
    
    page.drawText("Universal Tamil Academy", {
      x: width - 240,
      y: signatoryY - 35,
      size: 10,
      font: boldFont,
      color: primaryColor,
    });
    
    // Footer
    const footerY = 50;
    
    // Footer line - drawn first
    page.drawRectangle({
      x: 0,
      y: footerY + 30, // Positioned above footer content
      width: width,
      height: 1,
      color: mediumGray,
    });
    
    // Footer content
    page.drawText("Universal Tamil Academy - Nurturing Tamil Language Worldwide", {
      x: 50,
      y: footerY,
      size: 9,
      font: font,
      color: mediumGray,
    });
    
    page.drawText("Contact: universaltamilacademy@gmail.com", {
      x: width - 250,
      y: footerY,
      size: 9,
      font: font,
      color: mediumGray,
    });

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(Buffer.from(pdfBytes), {
  status: 200,
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Universal_Tamil_Academy_Invoice_${transactionId}.pdf`,
    "Content-Length": pdfBytes.length.toString(),
  },
});
  } catch (error: any) {
    console.error("Regenerate Invoice Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}