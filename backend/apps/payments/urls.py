from django.urls import path

from .views import CreatePaymentView, InvoiceView, PaymentHistoryView, VerifyPaymentView

urlpatterns = [
    path('create/', CreatePaymentView.as_view()),
    path('verify/', VerifyPaymentView.as_view()),
    path('history/', PaymentHistoryView.as_view()),
    path('invoices/<int:pk>/', InvoiceView.as_view()),
]
