using System;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public MessageHub(IMessageRepository messageRepository, IMapper mapper,
            IUserRepository userRepository)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        public override async Task OnConnectedAsync() 
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUserName(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var messages = await _messageRepository
                .GetMessageThread(Context.User.GetUserName(), otherUser);

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception) 
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto) 
        {
            var username = Context.User.GetUserName();

            if (username == createMessageDto.RecipientUserName.ToLower())
                throw new HubException("Você não pode enviar mensagens para si mesmo");

            var sender = await _userRepository.GetUserByUsernameAsync(username); //remetente
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUserName); //destinatario

            if (recipient == null) throw new HubException("Usuário não encontrado");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUserName = sender.UserName,
                RecipientUserName = recipient.UserName,
                Content = createMessageDto.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) 
            {
                var group = GetGroupName(sender.UserName, recipient.UserName);
                await Clients.Group(group).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
        }

        private string GetGroupName(string caller, string other) 
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}"; 
        }
    }
}