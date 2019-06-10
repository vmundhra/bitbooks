<template>
  <div>
    <p>Send Bitcoin to</p>
    <div v-if="order" class="section">
      <div class="tags has-addons">
        <span class="tag is-primary is-large">Amount</span>
        <span class="tag is-info is-large">{{order.amount}}</span>
      </div>
      <div class="tags has-addons">
        <span class="tag is-primary is-large">Address</span>
        <span class="tag is-info is-large">{{order.paymentAddress}}</span>
      </div>
      <div>
        <qrcode :value="encoding" :options="{ width: 200 }"></qrcode>
      </div>
      <div v-if="state === 'waiting'">
        <span class="loader"></span>
        <span class="title is-5">Waiting for confirmation</span>
      </div>
      <div v-if="state === 'received'">
        <span
          class="title is-5"
        >Payment received. We will send your e-book once we have 3 confirmation.</span>
      </div>
      <div v-if="state === 'error'">
        <span
          class="title is-5"
        >An error occured. Please contact support with order id {{order._id}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Orders from "@/api/orders";
import bip21 from "bip21";
import socketio from "socket.io-client";

export default {
  data() {
    return {
      order: null,
      socket: null,
      state: ""
    };
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  watch: {
    order() {
      if (this.order) {
        this.connect();
      }
    },
    socket() {
      this.socket.on("update", data => {
        this.handleUpdate(data);
      });
    }
  },
  async created() {
    this.order = await Orders.create(this.product);
  },
  computed: {
    encoding() {
      const { paymentAddress, amount, _id } = this.order;
      return bip21.encode(paymentAddress, {
        amount,
        label: `Bitbooks ${_id}`
      });
    }
  },
  methods: {
    connect() {
      const order = this.order._id;
      const query = { order };
      const location = `${window.location.host}`;
      this.socket = socketio(location, { resource: "/connect", query });
    },
    handleUpdate(data) {
      this.state = data.state;
    }
  }
};
</script>
