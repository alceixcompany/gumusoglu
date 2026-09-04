'use client'
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  urgency: string;
  message: string;
  createdAt: Timestamp;
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isReplied: boolean;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('Tümü');
  const [selectedPriority, setSelectedPriority] = useState<string>('Tümü');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');

  const statuses = ['Tümü', 'Yeni', 'Okundu', 'Yanıtlandı', 'Kapatıldı'];
  const priorities = ['Tümü', 'Düşük', 'Orta', 'Yüksek'];

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesQuery = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(messagesQuery);
      
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Yeni';
      case 'read': return 'Okundu';
      case 'replied': return 'Yanıtlandı';
      case 'closed': return 'Kapatıldı';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'normal': return 'Normal';
      case 'acil': return 'Acil';
      case 'cok-acil': return 'Çok Acil';
      default: return urgency;
    }
  };

  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case 'cilt-bakimi': return 'Cilt Bakımı';
      case 'lazer-epilasyon': return 'Lazer Epilasyon';
      case 'kas-kirpik': return 'Kaş ve Kirpik';
      case 'vucut-bakimi': return 'Vücut Bakımı';
      case 'bolgesel-zayiflama': return 'Bölgesel Zayıflama';
      case 'ipek-kirpik': return 'İpek Kirpik';
      case 'protez-tirnak': return 'Protez Tırnak';
      case 'leke-bakimi': return 'Leke Bakımı';
      case 'masaj': return 'Masaj';
      case 'kalici-makyaj': return 'Kalıcı Makyaj';
      case 'hydrafacial': return 'Hydrafacial';
      case 'akne-bakimi': return 'Akne Bakımı';
      case 'danismanlik': return 'Kişisel Danışmanlık';
      case 'randevu': return 'Randevu Planlama';
      case 'diger': return 'Diğer';
      default: return serviceType;
    }
  };

  const filteredMessages = messages.filter(message => {
    const statusMatch = selectedStatus === 'Tümü' || getStatusText(message.status) === selectedStatus;
    const priorityMatch = selectedPriority === 'Tümü' || getPriorityText(message.priority) === selectedPriority;
    return statusMatch && priorityMatch;
  });

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const messageRef = doc(db, 'contact_messages', messageId);
      await updateDoc(messageRef, {
        status: newStatus,
        isRead: newStatus === 'read' || newStatus === 'replied' || newStatus === 'closed',
        isReplied: newStatus === 'replied'
      });
      
      // Local state'i güncelle
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: newStatus as 'new' | 'read' | 'replied' | 'closed', isRead: newStatus === 'read' || newStatus === 'replied' || newStatus === 'closed', isReplied: newStatus === 'replied' }
          : msg
      ));
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
    }
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setReplySubject(`Re: ${getServiceTypeText(message.serviceType)} Hakkında`);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const messageRef = doc(db, 'contact_messages', selectedMessage.id);
      await updateDoc(messageRef, {
        status: 'replied',
        isRead: true,
        isReplied: true,
        replyText: replyText,
        replySubject: replySubject,
        repliedAt: new Date()
      });

      // Local state'i güncelle
      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id 
          ? { ...msg, status: 'replied', isRead: true, isReplied: true }
          : msg
      ));

      setShowReplyModal(false);
      setSelectedMessage(null);
      setReplyText('');
      setReplySubject('');
    } catch (error) {
      console.error('Yanıt gönderilirken hata:', error);
    }
  };

  const formatDate = (timestamp: Timestamp | Date | string | number | null | undefined) => {
    if (!timestamp) return 'Tarih yok';
    
    let date: Date;
    
    if (typeof (timestamp as { toDate?: () => Date }).toDate === 'function') {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return 'Tarih yok';
    }
    
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Mesajlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mesaj Yönetimi</h1>
        <p className="text-gray-600">Müşteri mesajlarını yönetin ve yanıtlayın</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {messages.filter(m => m.status === 'new').length}
          </div>
          <div className="text-sm text-gray-600">Yeni Mesaj</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {messages.filter(m => m.status === 'read').length}
          </div>
          <div className="text-sm text-gray-600">Okundu</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {messages.filter(m => m.status === 'replied').length}
          </div>
          <div className="text-sm text-gray-600">Yanıtlandı</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-600 mb-1">
            {messages.filter(m => m.status === 'closed').length}
          </div>
          <div className="text-sm text-gray-600">Kapatıldı</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Mesajlar ({filteredMessages.length})
            </h2>
            <div className="text-sm text-gray-500">
              Toplam: {messages.length} mesaj
            </div>
          </div>

          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {getStatusText(message.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {getPriorityText(message.priority)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>📧 {message.email}</span>
                      <span>📞 {message.phone}</span>
                      <span>🕒 {formatDate(message.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span><strong>Hizmet:</strong> {getServiceTypeText(message.serviceType)}</span>
                      <span><strong>Aciliyet:</strong> {getUrgencyText(message.urgency)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReply(message)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                      Yanıtla
                    </button>
                    <select
                      value={message.status}
                      onChange={(e) => handleStatusChange(message.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">Yeni</option>
                      <option value="read">Okundu</option>
                      <option value="replied">Yanıtlandı</option>
                      <option value="closed">Kapatıldı</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Mesaj bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">Seçilen filtrelere uygun mesaj bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedMessage.name} - Yanıt Yaz
              </h3>
              <button 
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Orijinal Mesaj:</h4>
              <p className="text-gray-700 text-sm">{selectedMessage.message}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Yanıt konusu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yanıtınız</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteriye yanıtınızı yazın..."
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Yanıt Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
