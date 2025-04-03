
export const defaultProfilePicture = "/assets/images/avatars/default.webp"
export const defaultBannerColor = "[19,113,147]";
export const allowSpecialCharactersInUsername = false;

export const maxPermissionLevel = 2 // 0 = user, 1 = moderator, 2 = admin, OWNER is not included in this;

export const NotFoundGif = [
    {
        id: 1,
        url: "/assets/images/404/not_found_1.gif",
        message: <p>Anyway, thanks for this great scenery, I like to eat popcorn while watching you smash your keyboard over this <span className='error-code'>404 error</span>.</p>
    },
    {
        id: 2,
        url: "/assets/images/404/not_found_2.gif",
        message: <p>Heyy, you!! Do you know who stole my precious page? Was it an <span className='error-code'>Error 404</span>, or a thief... Either way, I'll find him!</p>
    },
    {
        id: 3,
        url: "/assets/images/404/not_found_3.gif",
        message: <p>You were trying to cross the border, right? Walked right into that <span className='error-code'>404 Error</span> didn't you? Same as us, and that thief over there.</p>
    },
    {
        id: 4,
        url: "/assets/images/404/not_found_4.gif",
        message: <p>What do I see here? Someone who's trying to cross the line? Get back here now, or you'll be consumed by <span className='error-code'>Error 404</span> and me.</p>
    },
    {
        id: 5,
        url: "/assets/images/404/not_found_5.gif",
        message: <p>Who was it? You did it, didn't you... I saw that you were having fun with the <span className='error-code'>Error 404</span>, and don't try to lie to me.</p>
    }
]

export const apiServerIp = "http://localhost:9001";

export const globalTags = [
    { value: 'C#', label: 'C#' },
    { value: 'Lua', label: 'Lua' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'C++', label: 'C++' },
    { value: 'Python', label: 'Python' },
    { value: 'Rust', label: 'Rust' },
];