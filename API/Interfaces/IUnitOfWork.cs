using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IMessageRepository messageRepository {get;}
        ILikesRepository likesRepository {get;}
        Task<bool> Complete();
        bool HasChanges();
    }
}
