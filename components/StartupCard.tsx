import { formatDate } from "@/lib/utils"
import { EyeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { Startup } from "@/sanity/types"
import { Author } from "@/sanity/types"

export type StartupCardType = Omit<Startup, "author"> & {author? : Author}

function StartupCard({ post }: { post: StartupCardType }) {
    const { _createdAt, views, author, title, category, _id, image, description } = post
    return (
        <li className="startup-card group">
            <div className="flex-between">
                <p className="startup-card_date">
                    {formatDate(_createdAt)}
                </p>
                <div className="flex gap-1.5">
                    <EyeIcon className="size-6 text-primary" />
                    <span className="text-16-medium">{views}</span>
                </div>
            </div>
            <div className="flex-between mt-5 gap-5">
                <div className="flex-1">
                    <Link href={`/user/${author?._id}`}>
                        <p className="text-16-medium line-clamp-1">{author?.name}</p>
                    </Link>
                    <Link href={`/startup/${_id}`}>
                        <h3 className="text-26-semibold">{title}</h3>
                    </Link>
                </div>
                <Link href={`/user/${author?._id}`}>
                    <Image
                        src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                        alt="avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                </Link>
            </div>
            <Link href={`/startup/${_id}`}>
                <p className="startup-card_desc">{description}</p>
                <img src={image} alt="placeholder" className="startup-card_img"/>
            </Link>
            <div className="flex-between gap-3 mt-5">
                <Link href={`/?query=${category?.toLowerCase()}`}>
                    <p className="text-16-medium">{category}</p>
                </Link>
                <Button className="startup-card_btn" asChild>
                    <Link href={`/startup/${_id}`}>Details</Link>
                </Button>
            </div>
        </li>
    )
}
export default StartupCard