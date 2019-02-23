# importing required modules 
import PyPDF2 
  

def pdf2text(filename):
	# creating a pdf file object 
	# pdfFileObj = open(filename, 'rb') 

	with open(filename) as pdfFileObj:
	  
		# creating a pdf reader object 
		pdfReader = PyPDF2.PdfFileReader(pdfFileObj) 
		  
		# printing number of pages in pdf file 
		print('Found '+str(pdfReader.numPages)+' page(s)') 
		  
		# creating a page object 
		pageObj = pdfReader.getPage(0) 
		  
		# extracting text from page 
		r = pageObj.extractText()
		print(r) 
		
		# creating a text file
		text = open("test.txt","w")
		text.write(r.encode('utf-8'))
		text.close()

		# closing the pdf file object 
		pdfFileObj.close() 

pdf2text("test.pdf")
