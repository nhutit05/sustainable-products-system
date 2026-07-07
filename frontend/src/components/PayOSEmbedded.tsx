import { useEffect, useMemo, useState } from "react";
import { usePayOS } from "@payos/payos-checkout";
import type { PayOSConfig } from "@payos/payos-checkout";
import type { CartItemResponse } from "../model/cart.model";


interface OrderSummary {
    items: CartItemResponse[];
    total: number;
    discount: number;
    paymentMethod: string;
    receiver: string;
    phone: string;
    address: string;
}


interface PayOSEmbeddedProps {
    checkoutUrl: string;
    orderId: number;
    expiredAt: string | null;
    setOnClose: (value: boolean) => void;
    orderSummary: OrderSummary;
}



export default function PayOSEmbedded({
    checkoutUrl,
    orderId,
    expiredAt,
    setOnClose,
    orderSummary,
}: PayOSEmbeddedProps) {


    const [opened, setOpened] = useState(false);

    const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);



    const payOSConfig = useMemo<PayOSConfig>(() => ({
        RETURN_URL: window.location.href,
        ELEMENT_ID: "payos-container",
        CHECKOUT_URL: checkoutUrl,
        embedded: true,

        onSuccess: (event) => {
            console.log("PayOS Success", event);
        },

        onCancel: (event) => {
            console.log("PayOS Cancel", event);
        },

        onExit: (event) => {
            console.log("PayOS Exit", event);
        },

    }), [checkoutUrl]);



    const { open } = usePayOS(payOSConfig);




    useEffect(() => {

        if (!checkoutUrl || opened) return;


        const timer = setTimeout(() => {

            open();

            setOpened(true);

        }, 300);


        return () => clearTimeout(timer);


    }, [checkoutUrl, open, opened]);





    useEffect(() => {


        const timer = setInterval(() => {


            setRemainingSeconds(prev => {


                if (prev <= 1) {

                    clearInterval(timer);

                    return 0;

                }


                return prev - 1;


            });


        }, 1000);



        return () => clearInterval(timer);


    }, []);





    const minutes = Math.floor(remainingSeconds / 60);

    const seconds = remainingSeconds % 60;



    const countdown = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;





    return (

        <div className="
            fixed
            inset-0
            z-52
            flex
            items-center
            justify-center
            bg-black/30
        ">


            <div className="
                w-[95vw]
                max-w-7xl
                h-[90vh]
                bg-white
                rounded-3xl
                shadow-2xl
                p-6
                flex
                flex-col
                overflow-hidden
            ">


                <header className="
                    flex
                    items-center
                    justify-between
                    border-b
                    pb-4
                    mb-5
                ">


                    <div>

                        <h1 className="
                            text-3xl
                            font-bold
                            text-green-900
                        ">
                            Thanh toán đơn hàng
                        </h1>


                        <p className="
                            text-gray-500
                            mt-1
                        ">
                            Quét mã QR để hoàn tất thanh toán
                        </p>

                    </div>



                    <button
                        onClick={() => setOnClose(true)}
                        className="
                            text-xl
                            text-gray-500
                            hover:text-red-500
                            transition
                        "
                    >
                        ✕
                    </button>


                </header>





                <div className="
                    grid
                    grid-cols-[1fr_380px]
                    gap-6
                    flex-1
                    overflow-hidden
                ">


                    <section className="
                        rounded-3xl
                        border
                        bg-gray-50
                        p-5
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                    ">


                        <div
                            id="payos-container"
                            className="
                                w-full
                                h-full
                                flex
                                items-center
                                justify-center
                                [&_*]:max-w-full
                            "
                        />


                    </section>
                                        <aside className="
                        overflow-y-auto
                        pr-2
                        space-y-4
                    ">


                        <div className="
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-5
                            text-center
                        ">

                            <p className="
                                text-sm
                                text-gray-600
                            ">
                                Thời gian thanh toán còn lại
                            </p>


                            <p className="
                                mt-2
                                text-4xl
                                font-bold
                                tracking-widest
                                text-red-600
                            ">
                                {countdown}
                            </p>

                        </div>





                        <div className="
                            rounded-2xl
                            border
                            bg-white
                            shadow-sm
                            p-5
                        ">


                            <h2 className="
                                text-xl
                                font-bold
                                text-green-900
                                mb-4
                            ">
                                Thông tin đơn hàng
                            </h2>



                            <div className="
                                space-y-3
                                text-sm
                            ">


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Mã đơn hàng
                                    </span>

                                    <b>
                                        #{orderId}
                                    </b>

                                </div>




                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Thanh toán
                                    </span>

                                    <b>
                                        {orderSummary.paymentMethod}
                                    </b>

                                </div>



                            </div>


                        </div>






                        <div className="
                            rounded-2xl
                            border
                            bg-white
                            shadow-sm
                            p-5
                        ">


                            <h2 className="
                                font-bold
                                text-green-900
                                mb-3
                            ">
                                Người nhận
                            </h2>



                            <p>
                                {orderSummary.receiver}
                            </p>


                            <p>
                                {orderSummary.phone}
                            </p>



                            <p className="
                                mt-2
                                text-sm
                                text-gray-600
                            ">
                                {orderSummary.address}
                            </p>



                        </div>







                        <div className="
                            rounded-2xl
                            border
                            bg-white
                            shadow-sm
                            p-5
                        ">


                            <h2 className="
                                font-bold
                                text-green-900
                                mb-3
                            ">
                                Sản phẩm
                            </h2>




                            <div className="
                                space-y-3
                            ">


                                {
                                    orderSummary.items.map(item => (

                                        <div
                                            key={item.productId}
                                            className="
                                                flex
                                                justify-between
                                                gap-3
                                                text-sm
                                            "
                                        >


                                            <span>
                                                {item.productName} x{item.quantity}
                                            </span>



                                            <b>

                                                {
                                                    Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    ).format(item.subtotal)
                                                }

                                            </b>


                                        </div>

                                    ))
                                }



                            </div>



                        </div>








                        <div className="
                            rounded-2xl
                            bg-emerald-50
                            border
                            border-emerald-200
                            p-5
                        ">


                            <div className="
                                flex
                                justify-between
                            ">

                                <span>
                                    Giảm giá
                                </span>


                                <b className="
                                    text-red-500
                                ">

                                    -
                                    {
                                        Intl.NumberFormat(
                                            "vi-VN",
                                            {
                                                style: "currency",
                                                currency: "VND",
                                            }
                                        ).format(orderSummary.discount)
                                    }

                                </b>


                            </div>





                            <div className="
                                flex
                                justify-between
                                mt-4
                                text-xl
                                font-bold
                            ">


                                <span>
                                    Tổng tiền
                                </span>


                                <span className="
                                    text-green-900
                                ">

                                    {
                                        Intl.NumberFormat(
                                            "vi-VN",
                                            {
                                                style: "currency",
                                                currency: "VND",
                                            }
                                        ).format(orderSummary.total)
                                    }

                                </span>


                            </div>



                        </div>





                        <button
                            onClick={() => setOnClose(true)}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-gray-300
                                py-3
                                font-semibold
                                hover:bg-gray-100
                                transition
                            "
                        >
                            Đóng
                        </button>



                    </aside>



                </div>


            </div>


        </div>

    );

}