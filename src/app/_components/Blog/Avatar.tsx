'use client';
import Image from 'next/image';
import { FaRegUserCircle } from 'react-icons/fa';

export default function Avatar() {
  //   const isAuthorHaveFullName =
  //     author?.node?.firstName && author?.node?.lastName;
  //   const name = isAuthorHaveFullName
  //     ? `${author.node.firstName} ${author.node.lastName}`
  //     : author.node.name || null;

  return (
    <div className="flex items-center">
      <div className="flex gap-4">
        {/* <Image
          src={author.node.avatar.url}
          layout="fill"
          className="rounded-full"
          alt={name}
        /> */}
        <FaRegUserCircle size={30} />
        <div className="text-xl font-bold">Satyajit Sahoo</div>
      </div>
    </div>
  );
}
