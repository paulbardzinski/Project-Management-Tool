// Description: This file contains all the methods used in the profile component

import Axios from "axios";
import { isUsernameValid, isTagValid, isEmailValid, isFileValid, isPasswordValid, isPermissionLevelValid } from "../../utils/validateInput";
import { getAverageColor } from "../../utils/utils";
import { UpdateCustomPopup } from "../CustomPopup";
import { apiServerIp, defaultBannerColor, defaultProfilePicture } from "../globalVariables";

/////////////////////////////////////////////
// * VALID OPTIONS: *
// type: "<userinfo/password/avatar>" - update user info, password or avatar
// canSave: [<useState value>, <useState set function>] - stores if settings can be saved
// popupMethods: [<setPopupActive>, <setPopupTitle>, <setPopupDescription>]
// avatarFile: <useState value> - stores avatar file
/////////////////////////////////////////////
export const submitSettings = async (data, options = { type: "userinfo" }) => {
    // check if settings can be saved
    if (!options.canSave[0]) {
        return false;
    }

    let canUpdateData;

    // check if update is valid
    switch (options.type) {
        case "userinfo":
            canUpdateData = isUpdateValid(data.user);
            break;

        case "password":
            canUpdateData = isPasswordUpdateValid(data.user, data.isAdmin);
            break;

        case "avatar":
            canUpdateData = await isAvatarUpdateValid(data.user, options.avatarFile)
                .then(response => response)
                .catch(error => error);
            break;
        case "resetAvatar":
            canUpdateData = resetAvatar(data.user);
            break;

        default:
            break;
    }

    // declare popup context from options object
    const popupContext = options.popupContext;

    if (!canUpdateData.status) {
        // show error popup
        UpdateCustomPopup(popupContext.active, popupContext.title, popupContext.message);
        return false;
    }

    const controller = new AbortController();

    // send update request
    const response = await Axios.post(apiServerIp + "/api/post/updateuser",
        canUpdateData.value,
        { headers: { ...canUpdateData.headers }, signal: controller.signal })
        .then(response => response)
        .catch(err => err);

    // if update was successful
    if (response.data && response.data.status) {
        // reload page
        return window.location.reload();
    }

    // show error popup
    UpdateCustomPopup(popupContext.active,
        popupContext.title,
        [
            (response.data && response.data.message) || popupContext.message[0],
            popupContext.message[1]
        ]
    );

    return () => controller.abort();
}

// check if user update is valid
export const isUpdateValid = (data) => {
    // get user data from input fields
    const user_name = document.querySelector(".user-name-settings").value.trim() || data.user_name;
    const user_tag = document.querySelector(".user-tag-settings").value.trim() || data.user_tag;
    const user_email = document.querySelector(".user-email-settings").value.trim();
    let user_permissions = document.querySelector(".user-permissions-settings");

    // check if user_permissions exists
    if (user_permissions) {
        user_permissions = user_permissions.value;
    }

    let updateObject = {};

    // check if user_id exists
    if (!data.user_id) {
        return {
            status: false,
            value: updateObject
        };
    }

    // add user_id to updateObject
    updateObject.user_id = data.user_id;

    // first check if data is valid
    if (isUsernameValid(user_name).status
        && isTagValid(user_tag).status) {
        updateObject.user_name = user_name;
        updateObject.user_tag = user_tag;
    }

    if (isEmailValid(user_email).status) {
        updateObject.user_email = user_email;
    }

    if (isPermissionLevelValid(user_permissions).status) {
        updateObject.user_permissions = user_permissions;
    }

    // if there is valid data, check if it is different from current data
    if (updateObject.user_name === data.user_name && updateObject.user_tag === data.user_tag) {
        delete updateObject.user_name;
        delete updateObject.user_tag;
    }

    if (updateObject.user_email === data.user_email) {
        delete updateObject.user_email;
    }

    if (updateObject.user_permissions === data.user_permissions) {
        delete updateObject.user_permissions;
    }

    // check if there is any data to update than the user_id
    if (Object.keys(updateObject).length <= 1) {
        return {
            status: false,
            value: updateObject
        };
    }

    // otherwise return true
    return {
        status: true,
        value: updateObject
    };
}

// check if avatar update is valid
export const isAvatarUpdateValid = (data, image) => {
    return new Promise((resolve, reject) => {
        // create form data
        const formData = new FormData();

        // check if user id is valid
        if (!data.user_id) {
            return {
                status: false,
                value: {}
            };
        }

        // append user id to form data
        formData.append("user_id", data.user_id);
        formData.append("old_user_avatar_url", data.user_avatar_url);

        // check if image is valid
        if (!isFileValid(image).status) {
            return reject({ status: false, value: {} });
        }

        // append image to form data
        formData.append("user_avatar_file", image);

        // create image element with src of image
        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(image);

        // wait for image to load
        imgElement.onload = () => {
            // get image average color and append it to the form data
            const averageColor = getAverageColor(imgElement, 1);
            formData.append("user_banner_color", `[${averageColor.R},${averageColor.G},${averageColor.B}]`);

            if (data.user_avatar_file !== image.name) {
                return resolve({ status: true, value: formData, headers: { "Content-Type": "multipart/form-data" } });
            }

            // revoke object url if all checks fail
            URL.revokeObjectURL(imgElement.src);

            // remove image element
            imgElement.remove();

            return reject({ status: false, value: {} });
        }


    }); // end of promise
}

// check if password update is valid
export const isPasswordUpdateValid = (data, isAdmin) => {
    const user_old_password = document.querySelector("#user-old-password-settings");
    const user_new_password = document.querySelector("#user-new-password-settings").value.trim();
    const user_new_password_confirm = document.querySelector("#user-new-password-confirm-settings").value.trim();

    let updateObject = {};

    // check if user id is valid
    if (!data.user_id) {
        return { status: false, value: updateObject };
    }

    updateObject.user_id = data.user_id;

    // first check if data is valid
    if (isPasswordValid(user_new_password).status
        && isPasswordValid(user_new_password_confirm).status
        && user_new_password === user_new_password_confirm) {
        // if all checks pass, add data to object
        if (!isAdmin) {
            // check if old password is valid
            if (!isPasswordValid(user_old_password.value.trim()).status) {
                return { status: false, value: updateObject };
            }

            updateObject.user_old_password = user_old_password.value.trim();
        }

        updateObject.user_new_password = user_new_password;
        updateObject.user_repeat_new_password = user_new_password_confirm;
    }

    // check if object contains any data other than user_id
    if (Object.keys(updateObject).length <= 1) {
        return { status: false, value: updateObject };
    }

    // otherwise return true
    return { status: true, value: updateObject };
}

export const deleteAccount = (data, popupContext, navigate) => {
    // check if user id is valid
    if (!data.user_id) {
        return { status: false, value: {} };
    }

    const controller = new AbortController();

    Axios.post(apiServerIp + "/api/post/deleteUser", {
        user_id: data.user_id
    }, {
        signal: controller.signal
    }).then(response => {

        // if delete was successful
        if (response.data && response.data.status) {
            // reload page
            return response.data.deletedYourself ? navigate("/login") : navigate("/dashboard/users/");
        }

        // show error popup
        UpdateCustomPopup(popupContext.active,
            popupContext.title,
            [
                (response.data && response.data.message) || popupContext.message[0],
                popupContext.message[1]
            ]
        );
    }).catch(error => {
        if (error.name === "CanceledError") {
            return;
        }

        // show error popup
        UpdateCustomPopup(popupContext.active,
            popupContext.title,
            [
                (error.response && error.response.data && error.response.data.message) || popupContext.message[0],
                popupContext.message[1]
            ]
        );
    });

    return () => controller.abort();
}

export const isTransferUpdateValid = (data) => {
    const user_transfer_to = document.querySelector("#user-id-transfer");
    const transfer_confirm_input = document.querySelector("#transfer-confirm");

    let updateObject = {};

    // check if user id is valid
    if (!data.user_id) {
        return { status: false, value: updateObject };
    }

    updateObject.user_id = data.user_id;

    // check if transfer confirm input is valid
    if (transfer_confirm_input && transfer_confirm_input.value === "I want to transfer ownership") {
        // try to parse user target id
        try {
            updateObject.user_transfer_to = parseInt(user_transfer_to.value);
        } catch (error) {
            return { status: false, value: updateObject };
        }
    }

    // delete user_transfer_to if it is not a number
    if (isNaN(updateObject.user_transfer_to)) {
        delete updateObject.user_transfer_to;
    }


    // check if object contains any data other than user_id
    if (Object.keys(updateObject).length <= 1) {
        return { status: false, value: updateObject };
    }

    // otherwise return true
    return { status: true, value: updateObject };
}

export const transferOwnership = (data, popupContext) => {
    // check validity of data
    const isValid = isTransferUpdateValid(data);
    if (!isValid.status) {
        return { status: false, value: {} };
    }

    const controller = new AbortController();

    Axios.post(apiServerIp + "/api/post/transferOwnership", {
        user_id: isValid.value.user_id,
        user_id_transfer: isValid.value.user_transfer_to
    }, {
        signal: controller.signal
    }).then(response => {

        // if transfer was successful
        if (response.data && response.data.status) {
            // reload page
            return window.location.reload();
        }

        // show error popup
        UpdateCustomPopup(popupContext.active,
            popupContext.title,
            [
                (response.data && response.data.message) || popupContext.message[0],
                popupContext.message[1]
            ]
        );
    }).catch(error => {
        // show error popup
        UpdateCustomPopup(popupContext.active,
            popupContext.title,
            [
                (error.response && error.response.data && error.response.data.message) || popupContext.message[0],
                popupContext.message[1]
            ]
        );
    });

    return () => controller.abort();
}

export const resetAvatar = (data) => {
    // create form data
    const formData = new FormData();

    // check if user id is valid
    if (!data.user_id) {
        return {
            status: false,
            value: {}
        };
    }

    // append user id to form data
    formData.append("user_id", data.user_id);

    // append url of default avatar to form data
    formData.append("user_avatar_url", defaultProfilePicture);

    // append default banner setting to form data
    formData.append("user_banner_color", defaultBannerColor);

    // unless any errors were found prior, return true
    return { status: true, value: formData }
}